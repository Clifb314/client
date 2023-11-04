const APIurl = "http://localhost:5000/api/";


class ServerAccess {

    async getImageList() {
        const url = APIurl + 'list'
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch (error) {
            console.error('Error', error)
            return {err: 'Could not access image'}
        }
    }



    async getImage(id) {
        const url = APIurl + 'list/' + id
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.blob()
        } catch (error) {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }


    async getHints(id) {
        const url = APIurl + 'hints'
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(id),
                headers: {
                    'Content-Type': 'application/json'
                }

            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch (error) {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async submitGuess(guess) {
        //guess should have image id, x+y coordinates
        const url = APIurl + 'answer'
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(guess),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch (error) {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async endGame(data) {
        const url = APIurl + 'end-game'
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch(error) {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }

    async getScores() {
        const url = APIurl + 'scoreboard'
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return await response.json()
        } catch(error) {
            console.error('Error', error)
            return {err: 'Could not access server'}            
        }
    }
}

export default new ServerAccess()