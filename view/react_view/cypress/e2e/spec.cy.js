import authentication_api_url from '../../src/Authentication/authentication_api_url';
const screen = cy;

const cypressTester = { username: 'cypressTester', password: 'secr3t' }

let isUserRegistered = true;

async function getResgiteredUsers() {
  return await fetch(authentication_api_url + 'user/')
    .then(response => {
      return response.json()
    })
}

const setIsUserRegistered = async (username) => {
  const registeredUsers = await getResgiteredUsers()
  isUserRegistered = checkIfUsernameInResponse(registeredUsers, username)
}

const checkIfUsernameInResponse = (responseData, username) => {
  for (const key in responseData) {
    const currentUserData = responseData[key]
    if (username === currentUserData.username) {
      return true
    }
  }
  return false
}

const newPostData = {
  title: 'Cypress test post title',
  body: 'Cypress test post body',
  slug: 'cypress-test-slug'
}

const updatedPostData = {
  title: 'Updated Cypress test post title',
  body: 'Updated Cypress test post body',
  slug: 'updated-cypress-test-slug'
}

describe('end to end test with registered user', () => {
  beforeEach(async () => {
    await setIsUserRegistered(cypressTester.username)
  })

  it('should register/login', () => {
    if (isUserRegistered) {
      cy.visit('http://localhost:3500/login');
    } else {
      cy.visit('http://localhost:3500/register');
    }
    
    // write user data
    screen.findByRole('usernameinput').type(cypressTester.username);
    screen.findByRole('passwordinput').type(cypressTester.password)

    screen.findByRole('button', {
      name: /submit/i
    }).click()

    // authorization granted, now you are logged on home page
    cy.url().should('eq', 'http://localhost:3500/')


    // username should be printed on header
    screen.findByText('Hello ' + cypressTester.username + '!');
    
    screen.findByRole('button', {
      name: /new post/i
    }).click()

    // we are in new post page
    cy.url().should('include', '/post/new/edit')

    screen.findByRole('summit').should('have.text', 'Create').should("be.disabled")

    // fill up fields
    screen.findByRole('title-input', {
      name: /title/i
    }).type(newPostData.title)
    screen.findByRole('body-textarea', {
      name: /body/i
    }).type(newPostData.body)
    screen.findByRole('slug-input', {
      name: /slug/i
    }).type(newPostData.slug)

    screen.findByRole('summit').should('have.text', 'Create').should("be.enabled")
    screen.findByRole('summit').click()

    // we should've been redirected to home
    cy.url().should('eq', 'http://localhost:3500/')
    
    // wait for redis updated cache
    const msWaitTime = 3000
    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()

    const newPostListItem = screen.findByText(newPostData.title).parent();
    const newPostListItemLink = newPostListItem.findByText('Edit');
    newPostListItemLink.click()

    // we are in edit post page
    cy.url().should('include', `/post/${newPostData.slug}/edit`)

    screen.findByRole('summit').should('have.text', 'Update').should("be.disabled")

    // fill up fields
    screen.findByRole('title-input', {
      name: /title/i
    }).clear().type(updatedPostData.title)
    screen.findByRole('body-textarea', {
      name: /body/i
    }).clear().type(updatedPostData.body)
    screen.findByRole('slug-input', {
      name: /slug/i
    }).clear().type(updatedPostData.slug)
  

    screen.findByRole('summit').should("be.enabled").click()

    // we should've been redirected to home
    cy.url().should('eq', 'http://localhost:3500/')

    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()

    screen.findByText(updatedPostData.title)

    cy.visit(`http://localhost:3500/post/${updatedPostData.slug}/edit`)

    screen.findByRole('delete').wait(msWaitTime / 3).click()

    // we should've been redirected to home
    cy.url().should('eq', 'http://localhost:3500/')

    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()
    cy.wait(msWaitTime)
    cy.reload()

    screen.findByText(updatedPostData.title).should('not.exist')
    
  })
})