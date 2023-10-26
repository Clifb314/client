const APIurl = "http://localhost:5000/api/";


class ServerAccess {
    async getImage() {
        url = APIurl + 'rand'
        try {
            const response = fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }


    async getHints(image) {
        url = APIurl + 'hints'
        try {
            const response = fetch(url, {
                method: 'GET',
                mode: 'cors',
                body: JSON.stringify(image)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async submitGuess(guess) {
        url = APIurl + 'answer'
        try {
            const response = fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(guess)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async getImage(data) {
        url = APIurl + 'end-game'
        try {
            const response = fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async getScores() {
        url = APIurl + 'scoreboard'
        try {
            const response = fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }
}

export default new ServerAccess()