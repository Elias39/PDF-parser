This is a pdf parser which will take a pdf that a user uploads and will extract specific data.
The whole app is essentially two functions that mostly use PDF.js library's functions. 
               extractText() and DataExtraction().
               
exrtractText() was copied from here https://www.nutrient.io/blog/how-to-extract-text-from-a-pdf-using-javascript/ . 
It explains every line of the function,there has been only one change from his code,in the first .join() i changed the input parameter from '' to ' ' .
I did it cause it would ignore the /n and undesirably concatenate the desired coordinates.
What this function essentialy does is this,it extracts the entirety of the text from a pdf file into a string

DataExtraction() is essentially filtering out the input string and holds only specific wanted data through a REGEX filter.
We set two variables,our REGEX filter and its execution. Then we put the execution as an input parameter in a while loop and the code that runs essentially puts the match in every run inside an array.
Then we run the execution again by redeclaring it inside the while loop so it runs again and it will only stop if it doesnt find a successful match in a run,since that would mean the execution is a falsy 
value so the while loop stops.
Right after the while loop we reverse the order of items inside the array since we used the .unshift() which pushes the new entry always at the beginning of the array which means the wanted coordinate list would come out in reverse.


This was made by Elias Skopelitis and Dimitris Leader.
