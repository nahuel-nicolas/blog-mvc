import React, { useContext } from 'react';
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { useNavigate, MemoryRouter, Routes, Route, goHomePage, goLoginPage } from 'react-router-dom';

import AuthContext, { AuthProvider } from './AuthContext';
import PrivateComponent from './PrivateComponent';
import authentication_api_url from './authentication_api_url';

import { log } from '../utilities';

const userData = {
    user_id: 0,
    username: 'test'
}

const authContext = {
    ...userData,
    access: 'testaccess',
    refresh: 'testrefresh',
}

const mockFetchOk = (url, options) => {
    let response;
    switch (url) {
        case authentication_api_url + 'token/refresh/':
        case authentication_api_url + 'token/':
            response = authContext
            break
        case authentication_api_url + `user/`:
            response = {0: {username: 'test', id: 0}}
            break
        default:
            response = { error: 'Invalid url', ok: false }
            return Promise.resolve({
                json: () => Promise.resolve(response)
            })
    }
    return Promise.resolve({
        json: () => Promise.resolve(response),
        status: 200
    })
}

const mockFetchNoToken = (url, options) => {
    return Promise.resolve({
        json: () => Promise.resolve({ error: 'Invalid url', ok: false })
    })
}

const ContextConsumer = () => {
    const { user, authTokens } = useContext(AuthContext)
    return (
        <div role="container">
            <p role="username">{user?.username}</p>
            <p role="access">{authTokens?.access}</p>
        </div>
    )
}

vi.mock("jwt-decode", () => ({ 
    default: vi.fn(param => {
        if (param === authContext.access) {
            return userData
        } else if (typeof param === 'string' || param instanceof String) {
            try {
                return JSON.parse(param)
            } catch (error) {
                console.log('mock jwt-decode json parse failed:')
                console.log(param)
            }
        }
        return param
    }) 
}))

vi.mock("react-router-dom", async (importOriginal) => {
    const reactRouterDom = await importOriginal()

    const goLoginPage = vi.fn();
    const goHomePage = vi.fn();

    const mockedNavigateTo = vi.fn(navigateToPath => {
        log.debug(navigateToPath)
        if (navigateToPath == '/login') {
            goLoginPage()
        } else if (navigateToPath == '/') {
            goHomePage()
        }
    })
    
    const mockedUseNavigate = vi.fn(() => {
        return mockedNavigateTo
    })

    return {
        ...reactRouterDom,
        useNavigate: mockedUseNavigate,
        goLoginPage,
        goHomePage
    }
})


const RoutedPrivateContextConsumer = (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<PrivateComponent><ContextConsumer /></PrivateComponent>} />
        </Routes>
    </AuthProvider>
)

const navigateTo = useNavigate()

describe('Test PrivateComponent', () => {
    afterAll(() => {
        vi.restoreAllMocks();
    })

    describe('Consumer works perfectly', () => {
        beforeAll(() => {
            global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchOk)
        })

        it('should render', () => {
            render(RoutedPrivateContextConsumer, { wrapper: MemoryRouter })
            expect(useNavigate).toBeCalledTimes(2)
        })

        it('should print authContext.username and authContext.access', async () => {
            await waitFor(() => {
                screen.getByText(authContext.username)
                screen.getByText(authContext.access)

                it('should have called navigateTo', () => {
                    expect(navigateTo).toHaveBeenCalled()
                })
                
            })
        })
    })

    describe('Fetch return no token', () => {
        beforeAll(() => {
            cleanup();
            global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchNoToken);
        })

        it('should render', () => {
            render(RoutedPrivateContextConsumer, { wrapper: MemoryRouter });
        })

        it('should redirect to login page', async () => {
            await waitFor(() => {
                expect(navigateTo).toHaveBeenCalled()
                expect(goLoginPage).toHaveBeenCalled()
            })
        })
    })
})
