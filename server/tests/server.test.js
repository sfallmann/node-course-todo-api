const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');



const todos = [
    {
        _id: new ObjectID(),
        text: "Todo 1"
    },
    {
        _id: new ObjectID(),
        text: "Todo 2",
        completed: true,
        completedAt: new Date().getTime()
    },
    {
        _id: new ObjectID(),
        text: "Todo 3",
        completed: false,
        comepleteAt: null
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
			.end(done);
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
            .end((err)=>{
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
            .end((err) => {
                if (err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
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

describe('DELETE /todos:id', () => {
    
    it('should delete a todo by id', (done) => {
            
        let id = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));

            });

    });

    it('should return 404 if not found', (done) => {
        
        let id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if object-id is invalid', (done) => {
        
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);

    });
    

});

describe('PATH /todos/:id', () => {

    it('should update the todo', (done) => {
        
        let id = todos[0]._id.toHexString();
        let text = 'Updated first todo!';
        
        request(app)
            .patch(`/todos/${id}`)
            .send({ text: text, completed: true })
            .expect(200)
            .expect((res) => {

                let todo = res.body.todo;

                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(true);
                expect(todo.completedAt).toBeA('number');
            }).
            end(done);

    });

    it('should clear completeAt is not completed', (done) => {

        let id = todos[1]._id.toHexString();
        let text = 'Updated second todo!!';

        request(app)
            .patch(`/todos/${id}`)
            .send({ text: text, completed: false })
            .expect(200)
            .expect((res) => {
                
                let todo = res.body.todo;

                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(false);
                expect(todo.completedAt).toNotExist();

            })
            .end(done);
    });

    it('should return 404 if not found', (done) => {
        
        let id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if object-id is invalid', (done) => {
        
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);

    });    
})