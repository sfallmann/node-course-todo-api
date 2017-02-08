const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('PATCH /todos/:id', () => {

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



describe('GET /users/me', () => {

    it('should return authenticated user', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)            
            .expect(200)
            .expect((res) => {

                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });


    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'bad token')            
            .expect(401)
            .end(done);    
    });

});

describe('POST /users', () => {
    
    it('should create a new user', (done) => {
        const email = 'email@domain.com';
        const password = 'examplepassword';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();               
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
                .catch((e) => done(e));
            });
    });

    it('should return validation errors for an invalid request', (done) => {
        const email = 'email@domain.com';
        const password = '11';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);

    });

    it('should not create a new user for an exising email address', (done) => {
        const email = users[0].email;
        const password = 'Ag00dp4$$w0rd!';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)     
            .end(done);

    }); 
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {

        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(users[1].email);
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {

                if (err)
                    return done(err);

                User.findById(users[1]._id)
                .then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                })
                .catch((e) => done(e));
            })
    })

    it('should reject invalid login', (done) => {

        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: '1234' })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {

                if (err)
                    return done(err);

                User.findById(users[1]._id)
                .then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                })
                .catch((e) => done(e));
            })
    })

});

describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)  
    .end((err, res) => {
      if (err){
        return done(err);
      }
      User.findById(users[0]._id)
      .then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
      })
      .catch((e) => done(e));
    })
  });
});