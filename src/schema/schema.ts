import {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString, GraphQLBoolean} from "graphql"
import prisma from "../../prisma/prisma";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
  }
})

const PostType = new GraphQLObjectType({
  name: "Posts",
  fields: {
    id: {type: GraphQLString},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    published: {type: GraphQLBoolean},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    authorId: {type: GraphQLString},
    author: {
      type: UserType,
      resolve(parent) {
        return prisma.user.findUnique({
          where: {id: parent.authorId}
        })
      }
    }
  }
})

const PostResultType = new GraphQLObjectType({
  name: "PostsResult",
  fields: {
    results: {type: new GraphQLList(PostType)},
    total: {type: GraphQLInt},
    page: {type: GraphQLInt},
  }
})

const UsersResultType = new GraphQLObjectType({
  name: "UsersResult",
  fields: {
    results: {type: new GraphQLList(UserType)},
    total: {
      type: GraphQLInt
    },
    page: {type: GraphQLInt},
  }
})

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: UsersResultType,
      args: {limit: {type: GraphQLInt}, search: {type: GraphQLString}, page: {type: GraphQLInt}},
      async resolve(_parent, args) {
        const users = await prisma.user.findMany({
          where: args.search ? {
            name: {contains: args.search}
          } : {},
          skip: args.page ? (args.page - 1) * (args.limit || 10) : undefined,
          take: args.limit || undefined
        })
        return {
          results: users,
          total: users.length,
          page: args.page || null
        }
      }
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(_parent, args) {
        return prisma.user.findUnique({
          where: {id: args.id}
        })
      }
    },
    posts: {
      type: PostResultType,
      args: {limit: {type: GraphQLInt}, search: {type: GraphQLString}, page: {type: GraphQLInt}},
      async resolve(_parent, args) {
        const posts = await prisma.post.findMany({
          where: args.search ? {
            title: {contains: args.search}
          } : {},
          skip: args.page ? (args.page - 1) * (args.limit || 10) : undefined,
          take: args.limit || undefined
        })
        return {
          results: posts,
          total: posts.length,
          page: args.page || null
        }
      }
    },
    post: {
      type: PostType,
      args: {id: {type: GraphQLString}},
      resolve(_parent, args) {
        return prisma.post.findUnique({
          where: {id: args.id}
        })
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    newUser: {
      type: UserType,
      args: {email: {type: GraphQLString}, name: {type: GraphQLString}},
      resolve(_parent, args) {
        return prisma.user.create({
          data: {
            email: args.email,
            name: args.name
          }
        })
      }
    },
    deleteUser: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(_parent, args) {
        return prisma.user.delete({
          where: {id: args.id}
        })
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation
})