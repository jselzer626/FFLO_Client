import React, { useState } from 'react'

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [input, setInput] = useState({playerSearch: ''})
    const [loading, setLoading] = useState({initialLoading: true, loading: false})
    //const [step, setStep] = ({playerList: 100})

    const loadPlayerList = async () => {
        //e.preventDefault()

        try {
            let playerList = await fetch('http://127.0.0.1:8000/players/loadInitial')
            let playerListJson = await playerList.json()
            console.log(playerListJson)
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
                <div className="header">
                    {player.displayName}
                </div>
                <div className="Content">
                    {player.position} {player.team}
                </div>
            </div>
        )   
    }

    const renderPlayerList = () => {
        if (loading.initialLoading) {
            loadPlayerList()
            setLoading({...loading,initialLoading:false})
        }
        return (
            <div className="ui items">
                {fullPlayerList.map((player, index) => {
                    if (index < 100)
                        return renderPlayerCard(player)
                })}
            </div>
        )
    }

    return (
        <div className="App">
            <div className="ui text container">
                {renderPlayerList()}
            </div>
        </div>
    )
}

export default App;