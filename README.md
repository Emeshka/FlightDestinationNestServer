## FlightDestination - website about travelling

Realization of the same model as in FlightDirection repository, but with different stack. In this repository only the back-end is located.

![Screenshot_2](https://user-images.githubusercontent.com/65328222/158217782-19cf3c9d-215e-41e4-8e1a-95d5eac9455e.png)

API:

Get summary list of countries in given language. Language affects the title and textSnippet fields. If a country doesn't have an article in the provided language, the country will still be in the list, but title will be equal to the nameTransliterated and the textSnippet will be empty. It will be used to ask user if he wants to see an article in a different language anyway

    {/country/:lang, GET}

Create a country. It's created with an original name only, other fields should be edited through further PUT requests.

    {/country, POST}
    Content-Type: application/json
    Required body params: "name_original": string

Get summary list of towns in given language. Language affects the title and textSnippet fields. If a town doesn't have an article in the provided language, the town will still be in the list, but title will be equal to the nameTransliterated and the textSnippet will be empty. It will be used to ask user if he wants to see an article in a different language anyway.

    {/town/:lang, GET}

Create a town. It's created with an original name only, other fields should be edited through further PUT requests. By the original name the name in the native language and script is meant, it will then be transliterated and used in React Routing to make more informative URLs (Αθήνα => athena, 北京 => bei-jing).

    {/town, POST}
    Content-Type: application/json
    Required body params: "name_original": string

Get the article with given language and destination id. Returns an object, if nothing is found - fields of the object are null

    {/article/:lang/:destination_id, GET}

Get a file by id. Returns Base64 string

    {/file/:id, GET}

Upload a file as a byte array

    {/file, POST}
    Content-Type: multipart/form-data
    Required body params:
    file: Buffer
    name: string
    destination_id: integer

Stack:

- Node.js
- Nest.js, TypeScript
- Prisma - ORM/query construction
- PostgreSQL
