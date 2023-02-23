import grpc from '@grpc/grpc-js'
import protoLoader from "@grpc/proto-loader"
const PROTO_PATH = "./todo.proto"

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const todoProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server()

const fakeDb = [
  { id: 1, done: false, task: 'Task 01' },
  { id: 2, done: false, task: 'Task 02' },
]

function changeData(id, checked, task) {
  if (!task) task = 'not found'
  let res = { id, done: false, task }

  for (let i = 0; i < fakeDb.length; i++) {
    console.log('🔴 ===> id', id);
    console.log('🔴 ===> fakeDb[i].id', fakeDb[i].id);
    if (fakeDb[i].id === id){
      fakeDb[i].done = checked
      res = fakeDb[i]
    }
  }

  return res
}

server.addService(todoProto.TodoService.service, {
  insert: (call, cb) => {
    let todo = call.request
    let data = changeData(fakeDb.length + 1, false, todo.task)
    if (todo.task) fakeDb.push(data)
    cb(null, data)
  },
  list: (_, cb) => {
    cb(null, { todoItem: fakeDb })
  },
  mark: (call, cb) => {
    let item = call.request
    cb(null, changeData(item.id, item.checked))
  }
})


server.bindAsync(
  '127.0.0.1:50051', 
  grpc.ServerCredentials.createInsecure(), 
  (error, port) => {
    if (error) throw error
    console.log(`Server running at http://127.0.0.1:${port}`);
    server.start();
  }
)