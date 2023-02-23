import grpc from '@grpc/grpc-js'
import protoLoader from "@grpc/proto-loader"
const PROTO_PATH = "./todo.proto"

setInterval(() => {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const todoProto = grpc.loadPackageDefinition(packageDefinition);

  const client = new todoProto.TodoService('127.0.0.1:50051', grpc.credentials.createInsecure())

  client.list({}, (err, data) => {
    if (err) throw err
    console.log(data)
  })
}, 5000)
