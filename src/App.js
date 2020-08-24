import React, { useState } from 'react'

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [filteredPlayerList, setFilteredPlayerList] = useState([])
    const [input, setInput] = useState({playerSearch: ''})
    const [loading, setLoading] = useState({initialLoading: true, loading: false})
    const [noResults, setNoResults] = useState(false)
    //const [step, setStep] = ({playerList: 100})

    const handleInputChange = e => {
        let newList = fullPlayerList.filter(function(player) {
            if (this.count < 10 && player.displayName.toLowerCase().includes
                (e.currentTarget.value.toLowerCase()))
                {this.count ++
                return true}
        }, {count: 0})
        setFilteredPlayerList(newList)
    }
    
    const renderInputForm = () => {
        return (
            <div className = "ui form">
                <input className = "ui input"
                    type="text"
                    onChange={handleInputChange}
                >
                </input>
            </div>
        )
    }

    const loadPlayerList = async () => {
        //e.preventDefault()

        try {
            let playerList = await fetch('http://127.0.0.1:8000/players/loadInitial')
            let playerListJson = await playerList.json()
            setFullPlayerList(playerListJson)
        } catch(e) {
            console.warn(e)
        }
    }

    const renderPlayerCard = player => {
        return (
            <div className="item">
                <div>
                    <img
                    className='ui image tiny' 
                    src={player.profileImg}/>
                </div>
                <div className="content">
                    <div className="header">
                        {player.displayName}
                    </div>
                    <div className="description">
                        {player.position} {player.team}
                    </div>
                </div>
            </div>
        )   
    }

    const renderPlayerList = () => {
        if (loading.initialLoading) {
            loadPlayerList()
            setLoading({...loading,initialLoading:false})
        }
        if (filteredPlayerList.length === 0) {
            return (
                //need to make this a scrollable box with a max height
                //check semantic ui containers
                <div>
                    <div className="ui items">
                        {fullPlayerList.map((player, index) => {
                            if (index < 100)
                                return renderPlayerCard(player)
                        })}
                    </div>
                </div>
            )
        }
        else {
            return (
                //need to make this a scrollable box with a max height
                //check semantic ui containers
                <div>
                    <div className="ui items">
                        {filteredPlayerList.map((player, index) => {
                            return renderPlayerCard(player)
                        })}
                    </div>
                </div>
            )
        }
    }

    const renderNoResults = () => {
        if (!noResults) {
            return
        }
        return (
            <div>
                No Results
            </div>
        )
    }

    return (
        <div className="App">
            <div className="ui text container">
                {renderInputForm()}
                {renderPlayerList()}
                {renderNoResults()}
            </div>
        </div>
    )
}

export default App;