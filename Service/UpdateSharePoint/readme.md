# TimerTrigger - TypeScript

The `TimerTrigger` makes it incredibly easy to have your functions executed on a schedule. This sample demonstrates a simple use case of calling your function every 5 minutes.

## How it works

For a `TimerTrigger` to work, you provide a schedule in the form of a [cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression)(See the link for full details). A cron expression is a string with 6 separate expressions which represent a given schedule via patterns. The pattern we use to represent every 5 minutes is `0 */5 * * * *`. This, in plain text, means: "When seconds is equal to 0, minutes is divisible by 5, for any hour, day of the month, month, day of the week, or year".

# cron

https://crontab.guru/

## Storage emulator

https://www.eliostruyf.com/set-up-azure-storage-for-local-develop-of-timer-or-queue-triggered-azure-functions/

https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator

in a shell, start emulator

Service repository : 
cd "C:\repos\StageDamien\Services\Instagram2SharePoint"

cd "C:\Program Files (x86)\Microsoft SDKs\Azure\Storage Emulator"
.\AzureStorageEmulator.exe start

to stop
.\AzureStorageEmulator.exe stop

status
.\AzureStorageEmulator.exe status

## Debugging

Avec postman

Query: 
POST http://localhost:7071/admin/functions/UpdateSharePoint
Body: 
JSON {}
