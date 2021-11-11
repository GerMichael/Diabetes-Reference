<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>Save new Element Request</title>
  </head>
  <body>
    <?php
        $counter = 0;
        
        //https://www.php.net/manual/de/function.file-put-contents.php
        $file = 'element_requests.txt';

        $timestamp = date("Y-m-d h:i:sa");
        $values = "";
        $person_name = htmlspecialchars($_POST['person_name']);
        while(isset($_POST['el_name_' . $counter])){
          $el_name = htmlspecialchars($_POST['el_name_' . $counter]);
          $el_be_val = htmlspecialchars($_POST['el_be_val_' . $counter]);
          $el_ke_val = htmlspecialchars($_POST['el_ke_val_' . $counter]);
          $el_ref_val = htmlspecialchars($_POST['el_ref_val_' . $counter]);
          $el_ref_unit = htmlspecialchars($_POST['el_ref_unit_' . $counter]);
          $el_ref_title = htmlspecialchars($_POST['el_ref_title_' . $counter]);

          echo '"' . $el_name . '"';

          $values .= 
"CREATED:$timestamp;
person_name:$person_name;
  el_name:$el_name;
  el_be_val:$el_be_val;
  el_ke_val:$el_ke_val;
  el_ref_val:$el_ref_val;
  el_ref_unit:$el_ref_unit;
  el_ref_title:$el_ref_title;
DONE: 
\n";

          $counter += 1;
        }

        // Schreibt den Inhalt in die Datei
        // unter Verwendung des Flags FILE_APPEND, um den Inhalt an das Ende der Datei anzufügen
        // und das Flag LOCK_EX, um ein Schreiben in die selbe Datei zur gleichen Zeit zu verhindern 
        file_put_contents($file, $values, FILE_APPEND | LOCK_EX);
        echo "<script>window.close();</script>";
    ?>
    </body>
  </html>