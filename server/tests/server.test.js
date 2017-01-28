const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');



const todos = [
    {
        _id: new ObjectID(),
        "text": "Todo 1"
    },
    {
        _id: new ObjectID(),
        "text": "Todo 2"
    },
    {
        _id: new ObjectID(),
        "text": "Todo 3"
    }      
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('GET /todos', () => {

	it('should get all todos', (done) => {
		request(app)
        	.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(3);
				for (let i=0; i<3; i++){
					expect(res.body.todos[i].text).toEqual(todos[i].text);
				}
	
			})
			.end((err) => done(err));
   }); 
});

describe('POST /todos',() => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(4);
                    expect(todos[3].text).toBe(text);
                    done();
                }).catch((err)=>done(err));

            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((err) => done(err));
            })
    })
})


describe('GET /todos:id', () => {
    
    it('should return todo doc', (done) => {

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);   
        })
        .end(done);
    });

    it('should return 404 for todo not found', (done) => {
        var _id = new ObjectID();

        request(app)
        .get(`/todos/${_id.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);

    });
});