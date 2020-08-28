import React, { useState, useEffect } from 'react'
import LoadingSpinner from './images/Loading_Spinner.gif'
import { Modal, Button, Dropdown } from 'semantic-ui-react'
import { render } from 'react-dom'

const details = ['type', 'RB', 'QB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'Total', 'Bench']
const leagueTypes = ["Standard", "PPR"]
const flexPositions = ["WR", "TE", "RB"]
const allPositions = ['QB', 'WR', 'RB', 'TE', 'FLEX', 'K', 'DEF']
const specialDetails = ['type', 'Total', 'Bench']

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [showRosterSelect, setShowRosterSelect] = useState(false)
    const [filteredPlayerList, setFilteredPlayerList] = useState([])
    const [noResults, setNoResults] = useState({search: false, query: ''})
    const [currentRoster, setCurrentRoster] = useState([])
    const [rosterDetails, setRosterDetails] = useState({type: 'Standard', QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 2, DEF: 1, K: 1, Total: 15, Bench: 5})
    const [addedPlayerDetails, setAddedPlayerDetails] = useState({QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0})
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch('https://fflo-server.herokuapp.com/players/loadInitial').then(
            async(res) => {
                let playerList = await res.json()

                playerList.sort((playerA, playerB) => {
                    return playerA.standardRanking - playerB.standardRanking
                })

                setFullPlayerList(playerList)
                setLoading(false)
            }
        ).catch(e => {
            setHasError(true)
            setLoading(false)
        })

    }, [])






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
                    placeholder="Begin typing a player name"
                    type="text"
                    onChange={handleInputChange}
                >
                </input>
            </div>
        )
    }

    const renderRosterSelect = () => {

        return (
            <Modal
              onClose={() => setShowRosterSelect(false)}
              onOpen={() => setShowRosterSelect(true)}
              open={showRosterSelect}
              trigger={<p id="parametersChange">Parameters<i className="settings icon"></i></p>}
              //trigger={<Button primary small>Edit</Button>}
            >
              <Modal.Header>Roster Details</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                    <div className="ui form two column grid">
                        {details.map(detail => {
                        if (detail === "type") {
                            return (
                                <div className="row">
                                    <div className="column four wide">
                                        {detail}
                                    </div>
                                    <div className="column twelve wide">
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

                                </div>
                            )
                        }
                        return (
                            <div className="row">
                                <div className="column four wide">
                                    {detail}
                                </div>
                                <div className="column twelve wide">
                                    <input
                                        type="text"
                                        value={rosterDetails[`${detail}`]}
                                        onChange={(e) => {
                                            let newDetails = {...rosterDetails, [detail]: parseInt(e.currentTarget.value)||''}
                                            setRosterDetails(newDetails)
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setShowRosterSelect(false)} positive massive>
                  Save Details
                </Button>
              </Modal.Actions>
            </Modal>
          )


    }

    const renderFilter = () => {
        return (
            <Dropdown
                text="Filter"
                icon="filter"
                className="icon"
            >
                <Dropdown.Menu>
                    <Dropdown.Menu scrolling>
                        {allPositions.map((pos) => {
                            return (
                                <Dropdown.Item
                                    key={pos}
                                    text={pos}
                                    onClick={() => setFilteredPlayerList(fullPlayerList.filter((player) => player.position === pos))}
                            />
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
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
                <div className="ui left fixed vertical menu" id="rosterDetailsMenu"
                    style={{"max-width": "20vw", "margin-top": "6vh"}}
                >   
                    <div className="ui item" id="rosterDetailsHeader">
                        <h3>Needed:</h3>
                        {renderRosterSelect()}
                    </div>
                    {details.map((pos) => {
                        if (pos !== "type") {
                            return (
                                <div className="ui item tiny"
                                style={{backgroundColor: addedPlayerDetails[`${pos}`] >= rosterDetails[`${pos}`] ? 
                                "lightGreen" : ''}}
                                >
                                    <div className="label">
                                        {pos}
                                    </div>
                                    <div className="value">
                                        <h3>{rosterDetails[`${pos}`] - addedPlayerDetails[`${pos}`] >= 0 ? 
                                        rosterDetails[`${pos}`] - addedPlayerDetails[`${pos}`] : 0}</h3>
                                    </div>
                                </div>
                            )}
                    })}
                </div>
        )
    }

    const renderPlayerCard = (player, location="mainSearch") => {
        if (location==="mainSearch") {
            return (
                <div className="playerSearchProfile"
                    onClick={() => {
                        if (currentRoster.includes(player) && currentRoster.length < rosterDetails.Total) {
                            return}
                        modifyRoster(player, 'add')}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "gainsboro"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ""}
                    >
                    <div>
                        <img
                        className='ui image tiny' 
                        src={player.profileImg}/>
                    </div>
                    <div className="content">
                        <div className="header">
                            <b>{player.displayName}</b>
                        </div>
                        <div className="description">
                            {player.position} {player.team}
                        </div>
                    </div>
                </div>
            )   
        } else {
            return (
                <div className="ui segment raised"
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "gainsboro"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ""}
                    >
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
                    </div>
                </div>
            )  

        }
    }
    const renderLoadingGraphic = () => {
        return (
            <div className="loadingContainer">
                <img src={LoadingSpinner}/>
                <h3>Loading Player List</h3>
            </div>
        )
    }

    const renderPlayerList = () => {

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

            allPositions.map((pos) => {
                return ( 
                    <div className="rosterDisplayContainer">
                        <div className="currentRosterDisplay"
                        id="positionCounter">
                                <h2>{pos}</h2>
                                <p>{addedPlayerDetails[`${pos}`] > rosterDetails[`${pos}`] ? 
                                rosterDetails[`${pos}`] : addedPlayerDetails[`${pos}`]} of {rosterDetails[`${pos}`]} added</p>
                        </div>
                        <div className="currentRosterDisplay">
                        {currentRoster.filter((player) => player.position === pos).map((player) => {
                            return (
                                <div className="ui item tiny">
                                {renderPlayerCard(player, "sideBar")}
                                </div>
                            )
                        })}
                        </div>
                    </div>
                )
            })


        )
   
    }


    return (
        <div className="App">
            <div className="ui text container raised segment"> 
                <div className="ui two column grid stackable"
                    id="playerSearch">
                    <div className="column ten wide fullList">
                        <div>   
                                <h3
                                style={{"margin-bottom": "1vh", "text-align": "center"}}
                                >Build/Edit Roster</h3>
                                {renderInputForm()}
                                <div id="searchOptions">
                                    <h3>All Players</h3>
                                    {renderFilter()}
                                </div>
                                {loading ? renderLoadingGraphic() : renderPlayerList()}
                        </div>
                    </div>
                    <div className="column six wide">
                        <div id="searchOptions">
                            <h3>My Team:</h3>
                            {renderRosterSelect()}
                        </div>
                        <div id="rosterPositionContainer">
                            {renderRoster()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
