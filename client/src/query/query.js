import { gql } from "@apollo/client";
// mutation
export const LOGIN_MUTATION = gql`
  mutation UserLogin($input: inputLogin) {
    userLogin(input: $input) {
      access_token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Mutation($input: inputRegister) {
    addUser(input: $input) {
      _id
      name
      username
      email
    }
  }
`;

export const CREATE_LIKE = gql`
  mutation CreateLike($id: ID!) {
    createLike(_id: $id) {
      message
    }
  }
`;
export const CREATE_COMMENT = gql`
  mutation CreateComment($id: ID!, $input: inputComment) {
    createComment(_id: $id, input: $input) {
      message
    }
  }
`;

export const CREATE_CONTENT = gql`
  mutation Mutation($input: inputPost) {
    createPost(input: $input) {
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($input: inputFollow) {
    followUser(input: $input) {
      message
    }
  }
`;

// query
export const POST_QUERY = gql`
  query GetPost {
    getPost {
      _id
      content
      tags
      imgUrl
      likes {
        username
        createdAt
        updatedAt
      }
      Author {
        username
      }
    }
  }
`;

export const POSTBYID_QUERY = gql`
  query GetPostById($id: ID!) {
    getPostById(_id: $id) {
      comments {
        content
        username
        createdAt
        updatedAt
      }
      authorId
      _id
    }
  }
`;

export const SEARCH_USERNAME_QUERY = gql`
  query SearchUsername($username: String) {
    searchUsername(username: $username) {
      _id
      name
      username
      email
    }
  }
`;

export const FOLLOWING_FOLLOWERS_QUERY = gql`
  query UserById {
    userById {
      username
      Followers {
        _id
        name
        username
        email
      }
      Followings {
        _id
        name
        username
        email
      }
    }
  }
`;
