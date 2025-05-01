## IMPORTANT

This is a list of subreddit with the bigest communities, should be easy to create a product to promote there and grow.
https://gummysearch.com/tools/top-subreddits/size-huge/

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

# TODO

- Heatmap, Best Daily, Besr Weekly, etc. should not be attached to any stateful component or store. We should receive all formatting options trhough props. This way we can use the same component for emails.

- When the user first signs up we should show an onboarding. Prompt some subreddits that he can follow for free and usually allow self promotion or are good places to show off your product. For example, r/saas, r/entrepreneur, r/startups, r/indiedev, r/indiehackers, r/sideproject, r/smallbusiness, r/entrepreneur, r/startups, r/indiedev, r/indiehackers, r/sideproject, r/smallbusiness.

- Allow a user to EXPLORE (use as keyword) subreddits. This is a good way to find new subreddits to follow. A user should be able to explore most followed subreddits, subreddits with more users, etc.

- Maybe we should show a warning when the user timezone detected in the request we receive is different from the one in the user preferences. This way we can avoid sending emails at 3am.

-

-

-

-

-

###

- Repository: only handles DB interaction
- Service: handles business logic, a service can use other services

/services
/auth
authService.ts // register, login, logout
oauthService.ts // handle login with Google, etc.

/userSubreddits
followService.ts // follow/unfollow logic
subscriptionService.ts // get followed subreddits

/analytics
analyticsService.ts // fetches analytics based on user/subreddit
statsAggregator.ts // handles internal aggregation of scraped data

/notifications
digestEmailService.ts // assembles and sends digest emails

---

    🔁 Example: One Use Case Flow

Use Case: sendWeeklyDigestEmail(userId)
Where it lives: digestEmailService.ts

Flow:

Get the list of subreddits the user follows:
followService.getFollowedSubreddits(userId)

For each subreddit, get analytics:
analyticsService.getWeeklyAnalytics(userId, subredditId)

Format the data into an email-friendly report.

Send via email adapter:
emailProvider.send(userEmail, subject, body)

---

authService: login, register

oauthService: third-party auth

followService: follow/unfollow

subscriptionService: get followed subs

analyticsService: fetch data

digestEmailService: prepare & send daily/weekly emails

climbergirls
indoorbouldering
sveltejs
announcements
bouldering
