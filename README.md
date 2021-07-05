# ticketing-practice

## Usage/Examples

Uses a common npm library for error handling, events interfaces, and middlewares.

https://www.npmjs.com/package/@mikeyimgittix/common

```bash
yarn add @mikeyimgittix/common

```

**Custom Errors**

```
bad-request-error
database-connection-error
not-authorized-error
not-found-error
requst-validation-error

```

**Middlewares**

```
current-user
require-auth
validate-request

```

## Error Handling

For both synchronous and asynchronous error handling, just throw the custom error

```typescript
import { NameOfCustomError } from "@unitetheculture/common";

throw new NameOfCustomError("optional error message");
```

The error handler middleware will catch all custom errors and send an appropriate response to the client:

```typescript
{
  errors: [{ message: "error message", field: "optional field" }];
}
```

All error objects look like this to avoid confusion.

## Document Creation (MongoDB)

In order to take advantage of type safety, create a new document using the custom static method `build()` rather than instantiating a mongo model.

```typescript
import { User } from "../models/user";

const user = User.build({ email: "test@test.com", password: "password" });

// NOT const user = new User({email: "test@test.com" , password: "password" })

user.save();
```

## Asynchrous Messaging using NATS Streaming

**Required setup in every service**

Configure a NATS client wrapper in the root of the project

```typescript
import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
```

Initialize NATS client in index.ts

```typescript
import { natsWrapper } from "./nats-wrapper";

await natsWrapper.connect(
  process.env.NATS_CLUSTER_ID,
  process.env.NATS_CLIENT_ID,
  process.env.NATS_URL
);
natsWrapper.client.on("close", () => {
  console.log("NATS connection closed!");
  process.exit();
});
process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close());
```

**Publishers**

Example configuration of ticket:created event publisher

```typescript
import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@unitetheculture/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
```

Example of publishing a ticket:created event in a ticket service

```typescript
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

new TicketCreatedPublisher(natsWrapper.client).publish({
  id: ticket.id,
  title: ticket.title,
  price: ticket.price,
  userId: ticket.userId,
  version: ticket.version,
});
```

**Listeners**

Example configuration of ticket:created event listener

```typescript
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@mikeyimgittix/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
```

Initialize listener in index.ts

```typescript
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";

// Right after the initialization of NATS client shown above in "Required setup in every service"
new TicketCreatedListener(natsWrapper.client).listen();
```
