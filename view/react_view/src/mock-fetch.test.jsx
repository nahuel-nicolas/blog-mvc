import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

const ReactComponentExample = () => {
    const [state, setState] = useState('');

    useEffect(() => {
        fetch('a.com')
        .then(response => response.json())
        .then(data => {
            setState(data.data)
        })
    }, [])

    return <p role="component-body">{state}</p>
}

const myMockFetch = (url) => {
    let response;
    switch (url) {
        case 'a.com':
            response = { data: 'a', ok: true }
            break
        case 'b.com':
            response = { data: 'b', ok: true }
            break
        default:
            response = { error: 'Invalid url', ok: false }
            break
    }
    return Promise.resolve({
        json: () => Promise.resolve(response)
    })
}

describe('test mock fetch', () => {
    beforeAll(() => {
        global.fetch = vi.spyOn(global, 'fetch').mockImplementation(myMockFetch)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('fetch(a.com) should work', async () => {
        const response = await fetch('a.com');
        const data = await response.json()
        expect(data.data).toEqual('a')
        expect(data.ok).toBeTruthy()
        expect(data.error).toBeUndefined()
    })

    it('fetch(b.com) should work', async () => {
        const response = await fetch('b.com');
        const data = await response.json()
        expect(data.data).toEqual('b')
        expect(data.ok).toBeTruthy()
        expect(data.error).toBeUndefined()
    })

    it('fetch(c.com) should not work', async () => {
        const response = await fetch('c.com');
        const data = await response.json()
        expect(data.data).toBeUndefined()
        expect(data.ok).toBeFalsy()
        expect(data.error).equal('Invalid url')
    })

    describe('test mock fetch in react component', () => {
        it('should render <p>a</p>', async () => {
            render(<ReactComponentExample />)
            await waitFor(() => screen.getByText('a'))
        })
    })
})