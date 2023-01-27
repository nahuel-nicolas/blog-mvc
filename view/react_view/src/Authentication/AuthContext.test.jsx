import React, { useContext } from 'react';
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { useNavigate, MemoryRouter, Routes, Route } from 'react-router-dom';

import AuthContext, { AuthProvider } from './AuthContext';
import authentication_api_url from './authentication_api_url';


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

const mockFetchNoUsers = (url, options) => {
    let response;
    switch (url) {
        case authentication_api_url + 'token/refresh/':
        case authentication_api_url + 'token/':
            response = authContext
            break
        case authentication_api_url + `user/`:
            response = {}
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



const RoutedContextConsumer = (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<ContextConsumer />} />
        </Routes>
    </AuthProvider>
)

describe('Test AuthProvider', () => {
    beforeAll(() => {
        vi.resetModules()
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
        global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchOk)
    })

    afterAll(() => {
        vi.restoreAllMocks();
        cleanup();
    })

    it('should render', () => {
        render(<AuthProvider />, { wrapper: MemoryRouter });
    })

    describe('Test AuthContext Consumer', () => {
        describe('Consumer works perfectly', () => {
            beforeAll(() => {
                cleanup();
            })

            it('should render', () => {
                render(RoutedContextConsumer, { wrapper: MemoryRouter })
            })
    
            it('should print authContext.username and authContext.access', async () => {
                await waitFor(() => {
                    screen.getByText(authContext.username)
                    screen.getByText(authContext.access)
                })
            })
        })
        
        describe('Fetch returns no users', () => {
            beforeAll(() => {
                cleanup();
                global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchNoUsers);
            })

            it('should render', () => {
                render(RoutedContextConsumer, { wrapper: MemoryRouter });
            })

            it('should not print authContext.username and authContext.access', async () => {
                await waitFor(async () => {
                    expect(screen.getByRole('username')).toBeTruthy()
                    await expect(async () => screen.getByText(authContext.username)).rejects.toThrowError('Unable to find an element')

                    expect(screen.getByRole('access')).toBeTruthy()
                    await expect(async () => screen.getByText(authContext.access)).rejects.toThrowError('Unable to find an element')
                })
            })
        })

        describe('Fetch return no token', () => {
            beforeAll(() => {
                cleanup();
                global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchNoToken);
            })

            it('should render', () => {
                render(RoutedContextConsumer, { wrapper: MemoryRouter });
            })

            it('should not print authContext.username and authContext.access', async () => {
                await waitFor(async () => {
                    expect(screen.getByRole('username')).toBeTruthy()
                    await expect(async () => screen.getByText(authContext.username)).rejects.toThrowError('Unable to find an element')

                    expect(screen.getByRole('access')).toBeTruthy()
                    await expect(async () => screen.getByText(authContext.access)).rejects.toThrowError('Unable to find an element')
                })
            })

        })
    })
})
