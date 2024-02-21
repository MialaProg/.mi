<?php

//V2
class MialaFile
{

    public $path, $size, $statut, $text, $content, $separators, $struct;

    function __construct(string $path, array $separators = ["\n", "¤1", "¤2", "¤3"], array $file_struct = [[]], int $from_size = 0)
    {
        /**
         * @param string $path Chemin du fichier
         * @param array $separators Liste des séparateurs
         * @param array $file_struct Exemple: [[0, 0, [], 0, [0, []]]]
         */
        $this->path = $path;
        $this->size = $from_size;
        foreach ($separators as $sep) {
            if (str_contains($sep, '#') || str_contains($sep, '"') ||
                str_contains($sep, "\r") || str_contains($sep, "\x00")
            ) {
                throw new Exception('Separateur # ou " non-autorisé ! (MialaFilePHPEditor)', 1);
            }
        }
        $this->separators = $separators;
        $this->statut = 0;
        $this->text = false;
        $this->content = false;
        $this->struct = $file_struct;
    }

    private function openAndRead(): string
    {
        $handle = fopen($this->path, "r");
        $content = fread($handle, filesize($this->path));
        fclose($handle);

        return $content;
    }

    private function openAndWrite(string $content)
    {
        $handle = fopen($this->path, "w");
        fwrite($handle, $content);
        fclose($handle);
    }

    function Read(bool|int $forced = false): string|bool
    {
        clearstatcache();

        $filesize = filesize($this->path);
        if ($filesize == 0) {
            $this->size = 0;
            $this->text = "";
        } elseif ($forced || ($this->size != $filesize)) {
            $this->size = $filesize;

            $this->text = $this->openAndRead();
        }

        $this->statut = 1;

        return $this->text;
    }


    private function decrypt(string $txt, int $lvl, $struct): array
    {
        //struct Exemple: [[0, 0, [], 0, [0, []]]] ou [[, , ,]\n[]]
        $content = explode($this->separators[$lvl], $txt);
        $lvl += 1;
        foreach ($content as $id => &$line) {
            if (isset($struct[$id])) {
                if ($struct[$id] != 0) {
                    $line = $this->decrypt($line, $lvl, $struct[$id]);
                }
            } elseif (isset($struct[0]) && end($struct) != 0) {
                $line = $this->decrypt($line, $lvl, end($struct));
            }
            if (is_string($line)) {
                $line = trim($line, " \r\x00\"");
                foreach ($this->separators as $key => $sep) {
                    $line = str_replace('*#' . $key, $sep, $line);
                }
            }
        }
        unset($line);
        return $content;
    }
    private function crypt(array $arr, int $lvl): string
    {
        //struct Exemple: [[0, 0, [], 0, [0, []]]] ou [[, , ,]\n[]]
        foreach ($arr as &$line) {
            if (is_array($line)) {
                $line = $this->crypt($line, $lvl + 1);
            } else {
                foreach ($this->separators as $key => $sep) {
                    $line = str_replace($sep, '*#' . $key, $line);
                }
                $line = '"' . $line . '"';
            }
        }
        unset($line);


        return implode($this->separators[$lvl], $arr);
    }


    function ReadLines(bool|int $reload = false, bool|int $read_forced = false): array|bool
    {
        /**
         * callable $func
         * $func = function(&$line)
         */
        if ($reload || $this->statut < 1) {
            $this->Read($read_forced);
        }

        if ($this->text === false) {
            return false;
        }


        $this->content = $this->decrypt($this->text, 0, $this->struct);

        $this->statut = 2;

        return $this->content;
    }

    function WriteContent(): string
    {

        if ($this->content == false) {
            $this->openAndWrite('');
            return '';
        }

        if ($this->statut < 2) {
            $this->ReadLines();
        }

        $string_content = $this->crypt($this->content, 0);

        $this->openAndWrite($string_content);

        $this->statut = 0;

        return $string_content;
    }

}
