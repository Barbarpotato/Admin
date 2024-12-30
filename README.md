# CMS HOST
The Admin is an admin panel built using a microservices architecture. The project currently being viewed serves as the host site for a secret remote site. This admin panel is used to manage my personal website.

I adopted this architecture to enhance maintainability by breaking components into a host-remote pattern. This approach makes it easier to secure each component by segregating authority levels through the registry site.
The reason i need to implement SALC (Segregating Authority Levels Component) its because i want to use the github page as my platofrm to access my admin site 😂 (free & simple), but dont want my codebase fully expose. That's it, what a stupid reason😁. I'll explained a little bit about my SALC strategy.

# Authority Levels Component

## Third-Party Authentication

### Overview

Third-Party Authentication is used for components that require higher security due to their ability to **delete**, **create**, or **modify** data. This authentication mechanism ensures that only authorized users can access and perform actions on these sensitive components.

### How It Works

- To access these components, a **token** is required as a prop.
- The token is obtained by interacting with a third-party API.
- The third-party API performs authentication using a **username** and **password**. Once the user is authenticated, the API generates and provides a valid token.
- The token has an **expiration time** and will no longer be valid after the expiration period.

# The Host Component

In the host section. There is only client routing management which is used to manage remote components and also some imported remote component from my registry site.
As you can see that my component cannot be fully exposed due to my others component that i called is coming from other domain. It shows that every remote component need to have the token value
in order to render the appropriate content. if the token is not valid. it will show the access denied text.