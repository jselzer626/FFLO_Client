import React, { useState } from 'react'
import LoadingSpinner from './images/Loading_Spinner.gif'

const details = ['type', 'QB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'Total', 'Bench']
const leagueTypes = ["Standard", "PPR"]
const flexPositions = ["WR", "TE", "RB"]
const allPositions = ['QB', 'WR', 'TE', 'FLEX', 'K', 'DEF']

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [filteredPlayerList, setFilteredPlayerList] = useState([])
    const [input, setInput] = useState({playerSearch: ''})
    const [loading, setLoading] = useState({initialLoading: true, loading: false})
    const [noResults, setNoResults] = useState({search: false, query: ''})
    const [currentRoster, setCurrentRoster] = useState([])
    const [rosterDetails, setRosterDetails] = useState({type: 'Standard', QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 2, DEF: 1, K: 1, Total: 15, Bench: 5})
    const [addedPlayerDetails, setAddedPlayerDetails] = useState({QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0})
    //const [step, setStep] = ({playerList: 100})

    const handleInputChange = e => {
        setNoResults({...noResults, search: false})
        let newList = fullPlayerList.filter(function(player) {
            if (this.count < 10 && player.displayName.toLowerCase().includes
                (e.currentTarget.value.toLowerCase()))
                {this.count ++
                return true}
        }, {count: 0})
        if (newList.length === 0) {
            setNoResults({...noResults, search: true, query: e.currentTarget.value})
        }
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

        try {
            let playerList = await fetch('http://127.0.0.1:8000/players/loadInitial')
            let playerListJson = await playerList.json()
            setFullPlayerList(playerListJson)
        } catch(e) {
            console.warn(e)
        }

    }
    const renderRosterSelect = () => {
        return (
            details.map(detail => {
                if (detail === "type") {
                    return (
                        <div>
                            {detail}
                            {leagueTypes.map(leagueType => {
                                return (
                                    <button className="ui button small blue"
                                    onClick = {() => 
                                        {let newDetails = {...rosterDetails, type: leagueType}
                                        setRosterDetails(newDetails)}
                                    }>{leagueType}</button>
                                )
                            })}

                        </div>
                    )
                }
                return (
                    <div>
                        {detail}
                        <input
                            type="text"
                            value={rosterDetails[`${detail}`]}
                            onChange={(e) => {
                                let newDetails = {...rosterDetails, [detail]: parseInt(e.currentTarget.value)}
                                setRosterDetails(newDetails)
                            }}
                        />
                    </div>
                )
            })
        )
    }

    const modifyRoster = (currentPlayer, action) => {

        let newRoster = [...currentRoster]
        let newDetails = {...addedPlayerDetails}
        action === "add" ? newRoster.push(currentPlayer) : newRoster = newRoster.filter(player => player !== currentPlayer)
        let requiredStarters = 0
        allPositions.forEach(pos => {
            newDetails[`${pos}`] = newRoster.filter(player => player.position === pos).length
            requiredStarters += rosterDetails[`${pos}`]
        })
        newDetails.Total = currentRoster.length
        if (newDetails.Total > requiredStarters) {
            newDetails.Bench = newDetails.Total - requiredStarters
        }
        
        setCurrentRoster(newRoster)
        setAddedPlayerDetails(newDetails)

    }

    const renderRosterDetails = () => {

        return (
            details.map(detail => {
                if (detail !== "type") {
                return (
                    <div
                        style={{backgroundColor: addedPlayerDetails[`${detail}`] >= rosterDetails[`${detail}`] ? 
                        "lightGreen" : ''}}>
                        <b>{detail}</b>
                        {<br/>}
                        Total Needed: {rosterDetails[`${detail}`]}
                        {<br/>}
                        Left To add: {rosterDetails[`${detail}`] - addedPlayerDetails[`${detail}`] >= 0 ? 
                        rosterDetails[`${detail}`] - addedPlayerDetails[`${detail}`] : 0}
                    </div>
                )}
            })
        )
    }

    const renderPlayerCard = (player, location="mainSearch") => {
        if (location==="mainSearch") {
            return (
                <div className="item"
                    onClick={() => {
                        if (currentRoster.includes(player) && currentRoster.length < rosterDetails.Total) {
                            return}
                        modifyRoster(player, 'add')}}
                    >
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
        } else {
            return (
                <div className="ui segment raised">
                    <div>
                        <img
                        className='ui image tiny' 
                        src={player.profileImg}/>
                        <i className="times icon"
                            onClick={() => {
                                modifyRoster(player, 'delete')
                            }}>
                        </i>
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
    }

    const renderPlayerList = () => {

        if (loading.initialLoading) {
            loadPlayerList()
            setLoading({...loading,initialLoading:false})
        }

        if (noResults.search) {
            return (
                <div>
                    No matching results for {noResults.query}
                </div>
            )
        }
        if (filteredPlayerList.length === 0) {
            return (
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

    const renderRoster = () => {
        return (
            currentRoster.map((player) => {
                return renderPlayerCard(player, "sideBar")
            })
        )
    
    }


    return (
        <div className="App">
            <div className="ui text container">
                <div className="ui stackable three column grid">
                    <div className="four wide column ui raised segment">
                        Roster Details
                        {renderRosterSelect()}
                        Players Currently Added
                        {renderRosterDetails()}
                    </div>
                    <div className="eight wide column">
                        {renderInputForm()}
                        {renderPlayerList()}
                    </div>
                    <div className="four wide column">
                        My team
                        {renderRoster()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;