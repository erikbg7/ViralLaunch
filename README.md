# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

curl --request POST 'https://rsgmviizrlyjoudnqaws.supabase.co/functions/v1/reddit-active-users' \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ212aWl6cmx5am91ZG5xYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NjY2OTUsImV4cCI6MjA1NTU0MjY5NX0.HNVU6mbY-AtWWqCG1ajvddSXkJsrFEAywL29607MsJ8' \
 --header 'Content-Type: application/json' \
 --data '{ "name":"Functions" }'

curl --request POST 'http://127.0.0.1:54321/functions/v1/reddit-active-users' \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ212aWl6cmx5am91ZG5xYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NjY2OTUsImV4cCI6MjA1NTU0MjY5NX0.HNVU6mbY-AtWWqCG1ajvddSXkJsrFEAywL29607MsJ8' \
 --header 'Content-Type: application/json' \
 --data '{ "name":"Functions" }'

0oDdiXfQyf_dEP1LdPRIhwFO

# Launch the supabase server

supabase functions serve --env-file ./supabase/.env

# Drizzle apps

https://github.com/rajput-hemant/infinitunes/blob/master/src/lib/db/schema.ts

https://github.com/rajput-hemant/lipi/tree/master/lib/db

export const counterSchema = pgTable('counter', {
id: serial('id').primaryKey(),
count: integer('count').default(0),
updatedAt: timestamp('updated_at', { mode: 'date' })
.defaultNow()
.$onUpdate(() => new Date())
.notNull(),
createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

https://github.com/ocluf/justship/tree/main/src/lib/server/email

https://github.com/vanxh/openbio/tree/main/src/server

https://github.com/rajput-hemant/infinitunes/tree/master/src/lib/db

https://github.com/ocluf/justship/blob/main/src/lib/server/database/user.model.ts

I really like to move everything from payments to a /payments folder instead of having it on the api/.
For example, the webhook would be on /payments/webhook , then callback, then success. So everything related to payments is already in that folder encapsuled.

TODO

- Use subreddit name on the url (app/12321/r/SaaS). The name of the subreddit is already unique (capitalization matters), so we can just use it. Does it require changes to db? Do I require to use it as the id? Or just setting the name as unique is enough?
