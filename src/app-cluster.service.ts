import { Cluster } from 'cluster'
import * as os from 'os'
import { Injectable, Logger } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cluster: Cluster = require('cluster')
const numCPUs = os.cpus().length

let workerIndex = null
if (!cluster.isMaster) {
  const cb = (index: number) => {
    // Unregister immediately current listener for message
    process.off('message', cb)
    // Run application
    workerIndex = index
  }
  process.on('message', cb)
}

@Injectable()
export class AppClusterService {
  private readonly logger = new Logger(AppClusterService.name)

  enableShutdownHooks(): void {
    if (!cluster.isMaster) {
      return
    }
    //ensure workers exit cleanly
    process.on('SIGINT', this.stop.bind(this))
  }

  start(desiredWorkers: number, applicationFactory: (index: number) => void): void {
    if (desiredWorkers <= 0) {
      applicationFactory(0)
      return
    }
    if (!cluster.isMaster) {
      this.worker(applicationFactory)
      return
    }
    const workers = desiredWorkers > 2 * numCPUs ? 2 * numCPUs : desiredWorkers
    this.logger.log(
      `Master server  pid #${process.pid}, ask to fork ${desiredWorkers} / ${numCPUs}; forking up to ${workers}`,
    )
    const aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = 1
    console.log(
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa,
    )

    //ensure workers exit cleanly
    process.on('SIGINT', this.stop.bind(this))

    for (let i = 0; i < workers; i++) {
      cluster.fork().send(i)
    }
    cluster.on('online', (worker) => {
      this.logger.log(`Worker ${worker.process.pid} is online`)
    })
    cluster.on('exit', (worker, code) => {
      this.logger.log(`Worker ${worker.process.pid} died with code ${code}`)
    })
  }

  stop(): void {
    if (!cluster.isMaster) {
      return
    }
    this.logger.log('Cluster shutting down...')
    for (const id in cluster.workers) {
      cluster.workers[id].kill()
    }
  }

  private worker(applicationFactory: (index: number) => void) {
    this.logger.log(`fork pid #${process.pid} alive`)
    this.logger.log(`fork pid #${process.pid} is ${workerIndex}`)
    applicationFactory(workerIndex)
  }
}
