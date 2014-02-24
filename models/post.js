var mongodb = require('./db');

function Post(username, post, time) {
	this.user = username;
	this.post = post;
	if (time){
		this.time = time;
	}else{
		this.time = new Date();
	}
}

module.exports = Post;
Post.prototype.save = function save(callback) {
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};

	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		//读取post集合
		db.collection('posts', function(err, collection){
			if (err){
				mongodb.close();
				return callback(err);
			}

			//为user添加索引
			collection.ensureIndex('user');
			//写入一条post
			collection.insert(post, {safe: true}, function(err,post){
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}
		//获取posts集合
		db.collection('posts', function(err, collection){
			if (err){
				mongodb.close();
				return callback(err);
			}
			//查找属性为username的文档，如果username＝ null 则匹配全部
			var query = {};
			if (username){
				query.user = username;
			}

			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				mongodb.close();
				if (err){
					callback(err, null);
				}

				var posts = [];
				docs.forEach(function(doc, index){
					doc.push(post);
				});
				callback(null, posts);
			});
		});
	});
};













