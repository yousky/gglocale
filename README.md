# Convert a Google Spreadsheet to a language resource file 
json, xml for android, resx for .Net

## Demo Site
[Demo](https://gglocale.azurewebsites.net/)

It's a bit slow because I'm using the Azure free app service.

## How to use
On the website, enter the following information and click the Download button

![WebSite](/doc/website.PNG)

1. Document unique key in Google Spreadsheet
```
example
Url : https://docs.google.com/spreadsheets/d/1DTFjamybITTmjOcte7IWTDZ5tPhNHFGISH4PgJtYRK8
unique Key 1DTFjamybITTmjOcte7IWTDZ5tPhNHFGISH4PgJtYRK8
```

2. Authentication information (only if not public shared)
+ [How to make public shared](https://github.com/yousky/gglocale#how-to-make-public-shared)
+ [How to use service authentication](https://github.com/yousky/gglocale/#How-to-use-service-authentication)

3. Sheet name
4. Unique key column name for language resource (Value for first line)
5. Language value column name (Value for first line)
6. Select the type of file to download (json, xml for Android, resx for .Net files)


## Example
You can create a Google Spreadsheet similar to this

[Spreadsheet Sample](https://docs.google.com/spreadsheets/d/1DTFjamybITTmjOcte7IWTDZ5tPhNHFGISH4PgJtYRK8)

![Spreadsheet Sample](/doc/sheet_sample.PNG)

Web site filled with values
![FilledWebSite](/doc/website_sample_filled.PNG)



## How to make public shared
[Purblic Share](https://github.com/theoephraim/node-google-spreadsheet#unauthenticated-access-read-only-access-on-public-docs)

![Purblic Share 01](/doc/public_share_01.PNG)

1. Click Share on the document to give all web users view rights.

![Purblic Share 02](/doc/public_share_02.PNG)

2. Select "File" - "Publish to the Web".

![Purblic Share 03](/doc/public_share_03.PNG)

3. Publish


## How to use service authentication
[Service Authentication](https://github.com/theoephraim/node-google-spreadsheet#service-account-recommended-method)

Follow the instructions on the link site to download the json file.
Just enter the email and private key in the json file into the site.
