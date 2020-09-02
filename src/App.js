import React, { useState, useEffect } from 'react'
import LoadingSpinner from './images/Loading_Spinner.gif'
import fieldImg from './images/field.jpg'
import { Modal, Button, Dropdown, BreadcrumbDivider } from 'semantic-ui-react'
import { render } from 'react-dom'

const details = ['type', 'RB', 'QB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'Total', 'Bench']
const leagueTypes = ["Standard", "PPR"]
const flexPositions = ["WR", "TE", "RB"]
const allPositions = ['QB', 'WR', 'RB', 'TE', 'FLEX', 'K', 'DEF', 'Bench']
const specialDetails = ['type', 'Total', 'Bench']

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [showRosterSelect, setShowRosterSelect] = useState(false)
    const [filteredPlayerList, setFilteredPlayerList] = useState([])
    const [noResults, setNoResults] = useState({search: false, query: ''})
    const [currentRoster, setCurrentRoster] = useState({RB: [], QB: [], WR: [], TE: [], FLEX: [], K: [], DEF: [], Total: [], Bench: []})
    const [rosterDetails, setRosterDetails] = useState({type: 'Standard', QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 2, DEF: 1, K: 1, Total: 15, Bench: 5})
    const [addedPlayerDetails, setAddedPlayerDetails] = useState({QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0})
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [startPage, setStartPage] = useState(true)
    const [currentSelected, setCurrentSelected] = useState('')

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

    const showStartPage = () => {
        return (
            <div className="startMenu">
                <div>
                    <h1>Curated lineup reminders texted just in time!</h1>
                </div>
                <div className="startMenuButtons">
                    <div>
                        <a
                            onClick={() => setStartPage(false)}
                        ><h3>Create New</h3></a>
                    </div>
                    <div>
                        <a
                            onClick={() => setStartPage(false)}
                        ><h3>Edit Existing</h3></a>
                    </div>
                </div>
            </div>
        )
    }

    const renderRosterSelect = () => {

        return (
            <Modal
              onClose={() => setShowRosterSelect(false)}
              onOpen={() => setShowRosterSelect(true)}
              open={showRosterSelect}
              trigger={<p id="parametersChange">Settings<i className="setting icon"></i></p>}
              size="tiny"
              //trigger={<Button primary small>Edit</Button>}
            >
              <Modal.Header>Roster Details</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                    <div className="ui form two column grid">
                        {details.filter(item => item !== "Total").map(detail => {
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
                                            onClick = {e => {
                                                e.currentTarget.style.backgroundColor="#21ba45"
                                                let newDetails = {...rosterDetails, type: leagueType}
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
                                        type="number"
                                        value={rosterDetails[`${detail}`]}
                                        onChange={(e) => {
                                            let newDetails = {...rosterDetails, [detail]: e.currentTarget.value}
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
                            if (pos !== "Bench") {
                                return (
                                    <Dropdown.Item
                                        key={pos}
                                        text={pos}
                                        onClick={() => {
                                            setLoading(true)
                                            if (pos === "FLEX") {
                                                setFilteredPlayerList(fullPlayerList.filter((player) => flexPositions.includes(player.position)).filter((player, index) => index < 100))
                                            } else {
                                                setFilteredPlayerList(fullPlayerList.filter((player) => player.position === pos).filter((player, index) => index < 100))
                                            }
                                            setLoading(false)
                                        }}
                                />
                                )
                            }
                        })}
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        )

    }
    const modifyRoster = (currentPlayer, action) => {

        //recalculating each time
        //total is the only sublist that gets kept
        let newRoster = {...currentRoster, RB: [], QB: [], WR: [], TE: [], FLEX: [], K: [], DEF: [], Bench: []}
        let newDetails = {QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0}
        
        action === "add" ? newRoster.Total.push(currentPlayer) : newRoster.Total = newRoster.Total.filter(player => player !== currentPlayer)
        
        let rankingType = rosterDetails.type === "Standard" ? "standardRanking" : "pprRanking"
        //sort players so highest ranked automatically get sent to starting positions
        newRoster.Total.sort((playerA, playerB) => {return playerA[`${rankingType}`] - playerB[`${rankingType}`]} )

        newRoster.Total.forEach(player => {

            if (newDetails[`${player.position}`] >= rosterDetails[`${player.position}`]) {

                if (flexPositions.includes(player.position) && newDetails.FLEX < rosterDetails.FLEX){
                    newRoster.FLEX.push(player)
                    newDetails.FLEX++
                } else {
                    newRoster.Bench.push(player)
                    newDetails.Bench++
                }
            } else {
                newRoster[`${player.position}`].push(player)
                newDetails[`${player.position}`]++
            }
                newDetails.Total++
            
        })

        setCurrentRoster(newRoster)
        setAddedPlayerDetails(newDetails)

    }

    const renderPlayerCard = (player, location="mainSearch") => {
        if (location==="mainSearch") {
            return (
                <div>
                    <div className="playerSearchProfile"
                        style={{"backgroundColor": player.id === currentSelected ? "lightgreen" : 
                        currentRoster.Total.includes(player) ? "#FFFFBA" :
                        '' }}
                        onClick={e => {
                            if (currentRoster.Total.includes(player)) {
                                return}
                            modifyRoster(player, 'add')
                            setCurrentSelected(player.id)
                            }}
                        //only for desktop
                        onMouseEnter={e => window.screen.width > 400 ? e.currentTarget.style.backgroundColor = "gainsboro" : ''}
                        onMouseLeave={e => player.id !== currentSelected ? e.currentTarget.style.backgroundColor = "" : "lightgreen"}
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
                                {player.id === currentSelected ? <div id="addedGraphic">Added to roster!</div> : 
                                currentRoster.Total.includes(player) ? <div>Already in roster</div> : <div>{player.position} {player.team}</div>}
                            </div>
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
                    <div style={{"display": "flex"}}>
                        <img
                        className='ui image tiny' 
                        src={player.profileImg}/>
                        <i className="times icon large"
                            onClick={() => {
                                modifyRoster(player, 'delete')
                                setCurrentSelected('')
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
                                <h2>{pos}<i className="check circle icon green"
                                style={{"display": addedPlayerDetails[`${pos}`] === rosterDetails[`${pos}`] ? "inline-block" : "none"}}
                                    ></i></h2>
                                <p>{addedPlayerDetails[`${pos}`]} of {rosterDetails[`${pos}`]} added</p>
                                 
                        </div>
                        <div className="currentRosterDisplay">
                        {currentRoster[`${pos}`].map((player) => {
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
                { startPage ? showStartPage() : 
                <div className="ui two column grid stackable"
                    id="playerSearch">
                    <div className="column ten wide fullList">
                        <div>   
                                <h3
                                style={{"marginBottom": "1vh", "textAlign": "center"}}
                                >Build/Edit Roster</h3>
                                {renderInputForm()}
                                <div id="searchOptions">
                                    <h3>All Players</h3>
                                    {renderFilter()}
                                </div>
                                {loading ? renderLoadingGraphic() : renderPlayerList()}
                        </div>
                        <div id="listSpacer">
                            {loading ? '' : <p>Click on a player to add</p>}
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
                </div> }
            </div>
        </div>
    )
}

export default App;
