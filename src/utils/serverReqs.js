const APIurl = "http://localhost:5000/api/";


class ServerAccess {

    async getImageList() {
        url = APIurl + 'list'
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access image'}
        }
    }



    async getImage(id) {
        url = APIurl + 'list/' + id
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }


    async getHints(id) {
        url = APIurl + 'hints'
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                body: JSON.stringify(id)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async submitGuess(guess) {
        //guess should have image id, x+y coordinates
        url = APIurl + 'answer'
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(guess)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async endGame(data) {
        url = APIurl + 'end-game'
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async getScores() {
        url = APIurl + 'scoreboard'
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }
}

export default new ServerAccess()