const { RESTDataSource } = require('apollo-datasource-rest');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.GATEWAY_URL;
    this.initialize({});
  }

  willSendRequest(request) {
    request.headers.set('Content-Type', 'application/json');
  }

  addPostToUser(userID, postID) {
    return this.post('graphql', {
      query: `mutation addPostToUser($id: String!, $postID: String!) {
        addPostToUser(_id: $id, postID: $postID){
          _id
          username
        }
      }`,
      variables: {
        id: userID,
        postID,
      },
    });
  }

  getUser(id, token) {
    return this.post('graphql', {
      query: `query getUser($id: ID!) {
        user(_id: $id) {
          __typename
          ... on UserResult {
            result
            message
            data {
              __typename
              ... on User {
                _id
                phone
                username
                posts {
                  _id
                  title
                  content
                }
                subscribes {
                  _id
                  title
                  content
                }
              }
            }
          }
          ... on UserUnauthorized {
            error
          }
        }
      }`,
      variables: {
        id,
      },
    },
    {
      Authorization: `Bearer ${token}`,
    });
  }

  // async getMostViewedMovies(limit = 10) {
  //   const data = await this.get('movies', {
  //     per_page: limit,
  //     order_by: 'most_viewed',
  //   });
  //   return data.results;
  // }
}

module.exports = UsersAPI;
