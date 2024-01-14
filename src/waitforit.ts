import * as net from 'net'
import * as process from 'process'
import * as minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const host = args.host || 'localhost'
const port = args.port || 80
const retry = args.retry || 1000 // 1 second in milliseconds
const timeout = args.timeout || 10
const debug = 'debug' in args

if (debug) {
  console.log(
    `Settings: host=${host}, port=${port}, timeout=${timeout}, delay=${retry}, debug=${debug}`,
  )
}

let attempts = 0
let client: net.Socket

function connect() {
  attempts++
  client = new net.Socket()

  client.setTimeout(retry)

  client.connect(port, host, () => {
    if (debug) {
      console.log('Connected successfully11')
    }
    client.destroy()
    process.exit(0)
  })
  const nextAttempt = (error) => {
    if (debug) {
      console.log(`Attempt ${attempts} failed:`, error?.message || 'timeout')
    }
    client.destroy()

    connect()
    return
  }

  client.on('timeout', nextAttempt)

  client.on('error', nextAttempt)

  setTimeout(nextAttempt, retry)
}

connect()

setTimeout(() => {
  if (debug) {
    console.log('Timeout')
  }
  process.exit(1)
}, timeout * 1000)
