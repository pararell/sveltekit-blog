# Blog made with SvelteKit

## Svelte blog which using Markdown, FE Svelte - SvelteKit, BE Express + SQLite

<br/>
Pages and blogs are dynamically created with Markdown or Joddit and they are server-side rendered then - for SEO and client-side for interaction. Option for only HTML without Javascript was added - header will work with language switcher 
<br/><br/>

Set .env in main directory and in /server

- adminEmail - email which can add/edit/remove pages and blogs
- disqusSrc - optional to have comments from disqus
- cookieSecret, cookieName, TOKEN_KEY - random string

- works with Node.js v.18+

<code>npm run build</code>
<br/><br/>
<code>cd server npm run dev</code>
<br/><br/>
Server and Client run on the same port - it should check if the build exist and if yes, it will include SSR Sveltekit
<br/>
` if (fs.existsSync('../build/handler.js')) { const {handler} = await import('../build/handler.js'); app.use(handler); }`

- Use **jsonwebtoken** for the Authorization
- Use **express-session** for the session management in Express
- Use language switch with **svelte-i18n**
- Pages and Blogs creation with **marked**
  <br>

  test - privatelibrary.eu
  <br/><br/>

  ## With Docker

   <br>
   
  - build docker: docker build -t sveltekit-blog:0.5.1 . (docker build --platform linux/amd64 -t sveltekit-blog:0.5.1 .)
  - from dockerhub: docker pull pararel/sveltekit-blog:0.5.1
  - docker run -it -d -v $PWD/server/database:/usr/src/app/server/database --env-file $PWD/.env --network=host sveltekit-blog:0.5.1
    
  <br/><br/>
  <img width="400" src="https://res.cloudinary.com/dnpgh1vhi/image/upload/v1669123043/screenshot_2022-11-22_o_14.16.09_fofgol.png">
