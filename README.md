# CMS HOST
The Admin is an admin panel built using a microservices architecture. The project currently being viewed serves as the host site for a secret remote site. This admin panel is used to manage my personal website.

I adopted this architecture to enhance maintainability by breaking components into a host-remote pattern. This approach makes it easier to secure each component by segregating authority levels through the registry site.
The reason i need to implement SALC (Segregating Authority Levels Component) its because i want to use the github page as my platofrm to access my admin site 😂 (free & simple), but dont want my codebase fully expose. That's it, what a stupid reason😁. I'll explained a little bit about my SALC strategy.

# Segregating Authority Levels Component

In the Reigistry site that i build, two types of security mechanisms are used to protect components based on their level of authority and sensitivity of the data they handle. These security mechanisms are:

- **Third-Party Authentication**
- **Secret-Based Authentication**

## 1. Third-Party Authentication

### Overview

Third-Party Authentication is used for components that require higher security due to their ability to **delete**, **create**, or **modify** data. This authentication mechanism ensures that only authorized users can access and perform actions on these sensitive components.

### How It Works

- To access these components, a **token** is required as a prop.
- The token is obtained by interacting with a third-party API.
- The third-party API performs authentication using a **username** and **password**. Once the user is authenticated, the API generates and provides a valid token.
- The token has an **expiration time** and will no longer be valid after the expiration period.

### Use Case

- Components that handle critical actions, such as creating, updating, or deleting data.
- High-security components that require frequent authentication checks.

## 2. Secret-Based Authentication

### Overview

Secret-Based Authentication is used for components that operate with **lower levels of authority**, primarily those that have **read-only** access to data in the database layer. These components are still secured by a token, but the token is not dynamically generated like in third-party authentication.

### How It Works

- A **secret token** is used as a prop for accessing these components.
- The **secret token** is **static**, meaning it does not expire or change frequently.
- The secret token is securely set and stored in the **CI/CD pipeline configuration**.
- The project reads this token as an environment variable when needed, ensuring that the secret is never exposed in the codebase.

### Use Case

- Components that only require read access to data and do not need to perform any modification operations.
- Lower-security components that don’t interact with sensitive data.

## Configuration

### Third-Party Authentication

1. Ensure the third-party authentication API is properly configured to generate and validate tokens. In this case we use `Coretify`
2. Tokens must be passed as a prop to the components that require higher security (create, delete, modify).
3. The token is provided after successful authentication using a username and password.
4. The exposed component will check that the token back is valid or not trough the `Coretify` API.

### Secret-Based Authentication

1. The secret token is configured within the CI/CD pipeline. the secret value can be store as a secret in github actions
2. The token should be stored as an environment variable (`.env` file or similar) in this project.
3. Ensure that the secret token remains static and does not change frequently.
4. The exposed component will check the token is that matches with env variable secret.

# The Host Component
In the host section. There is only client routing management which is used to manage remote components and also some imported remote component from my registry site.
As you can see that my component cannot be fully exposed due to my others component that i called is coming from other domain. It shows that every remote component need to have the token value
in order to render the appropriate content. if the token is not valid. it will show the access denied text.