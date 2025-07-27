import express, {Application} from 'express';
import cors from 'cors';
import {createHandler} from "graphql-http/lib/use/express"
import {env} from "./env";
import schema from "./schema/schema";

const app: Application = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.all('/', createHandler({
  schema
}))

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
})