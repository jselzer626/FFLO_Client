import React, { useState, useEffect } from 'react'
import LoadingSpinner from './images/Loading_Spinner.gif'
import helmet from './images/helmet.png'
import doh from './images/doh.gif'
import ffnLogo from './images/ffnlogo2.gif'
import { Modal, Dropdown } from 'semantic-ui-react'
import { render } from 'react-dom'
import football from './images/headerfootball.png'

const details = ['type', 'name', 'RB', 'QB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'Total', 'Bench']
const leagueTypes = ["Standard", "PPR"]
const flexPositions = ["WR", "TE", "RB"]
const allPositions = ['QB', 'WR', 'RB', 'TE', 'FLEX', 'K', 'DEF', 'Bench']
const specialDetails = ['type', 'Total', 'Bench']
const rosterDetailsStart = {type: 'Standard', QB: 1, RB: 2, WR: 3, TE: 1, FLEX: 2, DEF: 1, K: 1, Total: 11, Bench: 1}
const addedPlayerDetailsStart = {QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0}
const currentRosterStart = {RB: [], QB: [], WR: [], TE: [], FLEX: [], K: [], DEF: [], Total: [], Bench: [], name:"NewLineup1"}

function App() {

    const [fullPlayerList, setFullPlayerList] = useState([])
    const [showRosterSelect, setShowRosterSelect] = useState(false)
    const [filteredPlayerList, setFilteredPlayerList] = useState([])
    const [noResults, setNoResults] = useState({search: false, query: ''})
    const [currentRoster, setCurrentRoster] = useState({RB: [], QB: [], WR: [], TE: [], FLEX: [], K: [], DEF: [], Total: [], Bench: [], name:"NewLineup1"})
    const [rosterDetails, setRosterDetails] = useState({type: 'Standard', QB: 1, RB: 2, WR: 3, TE: 1, FLEX: 2, DEF: 1, K: 1, Total: 11, Bench: 1})
    const [addedPlayerDetails, setAddedPlayerDetails] = useState({QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0, DEF: 0, K: 0, Total: 0, Bench: 0})
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState({generalError: false, duplicateError: false})
    const [startPage, setStartPage] = useState(true)
    const [showMenu, setShowMenu] = useState(false)
    const [currentSelected, setCurrentSelected] = useState('')
    const [SMSDetails, setSMSDetails] = useState({showForm: false, autoShow: true, sendNumber: '', verifyCode:'', sendSuccess:false, verified:false, initialSend:false})
    const [findRoster, setFindRoster] = useState({showForm: false,  sendNumber:'', rostersRetrieved:[], sendSuccess: false})
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const [showAbout, setShowAbout] = useState(false)
    const [showStartOptions, setShowStartOptions] = useState(false)

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
                    <h1>Never miss a fantasy football lineup again!</h1>
                </div>
                <div id="startFact"
                    style={{"backgroundColor": "whitesmoke", "border": "1px solid gainsboro",
                    "padding-top": "1.5vh", "padding-bottom": "1.5vh"
                    }}    
                >
                    <i className="clock outline icon big"></i>
                    <p>Lineup Reminder texts you weekly curated lineup recommendations
                    </p>
                </div>
                <div id="startFact">
                    <p>Create and update rosters easily. We'll message you every Thursday at 5PM with start/sit suggestions.
                    </p>
                    <i className="mail icon big"></i>
                </div>
                <div id="startFact"
                    style={{"backgroundColor": "whitesmoke", "border": "1px solid gainsboro",
                    "padding-top": "1.5vh", "padding-bottom": "1.5vh"}}
                >
                    <i className="line graph icon big"></i>
                    <p>Rankings are updated every 48 hours by guys who spend way too long looking at sports
                    </p>
                </div>
                <div id="startFact">
                    <p>Totally free to use and opt out anytime. 
                    </p>
                    <i className="undo icon big"></i>
                </div>
                    
                <div
                    style={{"border-top": "1px solid gainsboro", "padding-top": "2vh"}}    
                >
                    {startOptionsModal()}
                </div>
            </div>
        )
    }

    const startOptionsModal = () => {
        return (
            <Modal
                size="tiny"
                closeIcon
                open={showStartOptions}
                onOpen={() => setShowStartOptions(true)}
                onClose={() => setShowStartOptions(false)}
                trigger={ <button
                    className="massive fluid ui button"
                    id="startButton"
                    >Let's get started!</button>}
            >
                <Modal.Header>
                    <h1>Welcome!</h1>
                </Modal.Header>
                <Modal.Content>
                    <div className="startOptionButtons">
                    <div>
                        <button
                            className="ui fluid large button"
                            style={{"backgroundColor": "darkgreen", "color": "white"}}
                            onClick={() => {
                                setStartPage(false)
                                setTimeout(() => setShowAbout(true), 3000)
                            }}
                        >
                            Create New Lineup
                            </button>
                    </div>
                    <div>
                        <button
                            className="ui fluid large button"
                            style={{"backgroundColor": "darkgreen", "color": "white"}}
                            onClick={() => setFindRoster({...findRoster, showForm: true})}
                        >Edit Existing Lineup</button>
                    </div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
  
    useEffect(() => {

        if (allPositions.every(pos => parseInt(rosterDetails[`${pos}`]) === addedPlayerDetails[`${pos}`]) 
            && findRoster.rostersRetrieved 
            && findRoster.rostersRetrieved.length === 0) {

            if (SMSDetails.autoShow) {
                setSMSDetails({...SMSDetails, showForm: true, autoShow: false})
            } 
        }

    })

    const handleCode = async (e, action) => {
        
        try {
            let SMSForm = new FormData()
            SMSForm.append('number', SMSDetails.sendNumber)
            
            if (action==="verify") {
                SMSForm.append('code', SMSDetails.verifyCode)
            } else {
                SMSForm.append('roster', JSON.stringify(currentRoster))
                SMSForm.append('parameters', JSON.stringify(rosterDetails))
            }

            let url = action === 'verify' ? 'https://fflo-server.herokuapp.com/players/verifyCode' :
            'https://fflo-server.herokuapp.com/players/generateCode'

            let fetchResults = await fetch(url, {
                method: 'POST',
                body: SMSForm
            })
            let resultsJson = await fetchResults.json()
            console.log(resultsJson)
            if (resultsJson) {
                if (resultsJson === "send success") {
                    setSMSDetails({...SMSDetails, sendSuccess: true, initialSend: true})
                } else if (resultsJson === "verified") {
                    setSMSDetails({...SMSDetails, verified: true, initialSend: true})
                } else if (resultsJson === "error") {
                    setHasError({...hasError, generalError: true})
                } else if (resultsJson === "duplicate name") {
                    setHasError({...hasError, duplicateError: true})
                }
            }
            
        } catch(e) {
            setHasError({...hasError, generalError: true})
            console.warn(e)
        }

    }

    const renderErrorMessage = (message="Oops! Something went wrong") => {
        return (
            <div style={{"textAlign": "center"}}>
                <h2>{message}</h2>
                <div className="ui image fluid"
                    style={{"padding-right": "5vh", "padding-left": "5vh"}}    
                >
                    <img src={doh}/>
                </div>
            </div>
        )
    }

    const renderAboutModal = () => {

        return (
            <Modal
                size="tiny"
                closeIcon
                open={showAbout}
                onOpen={() => setShowAbout(true)}
                onClose={() => setShowAbout(false)}
                trigger={<p
                    onClick={() => setShowMenu(!showMenu)}
                ><i className="icon football ball"></i>About</p>}
            >
                <Modal.Header
                    style={{"backgroundColor": "darkgreen", "color": "white"}}>
                    <h2>Here's the rundown...</h2>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description
                    id="aboutOptions">
                        <div><p>Edit roster parameters with <span style={{"color": "gray"}}><i className="setting icon"></i>Settings</span> (We've added some presets to start)
                        </p></div>
                        <div><p>Once all your added players are added, a <button className="ui small button positive">Set up reminder!</button> button will appear.</p></div>
                        <div><p>Add your phone number and confirm the 6 digit code we send</p></div>
                        <div><p>Your roster is now saved! Look out for a text Thursdays at 5PM with lineup suggestions</p></div>
                        <div><p>Opt out anytime by clicking <button className="ui small button negative">Delete Lineup</button></p></div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )


    }
    const renderSMSFormContent = () => {
        
        if (!SMSDetails.initialSend) {
            return (
                <form className="ui form">
                    <p>Please enter your phone number below</p>
                    <input 
                        className="ui input"
                        type="text"
                        placeholder="Enter number without spaces e.g. ##########"
                        onChange={(e) => {
                            setSMSDetails({...SMSDetails, sendNumber: e.currentTarget.value})
                        }}
                    ></input>
                </form>
            ) 
        } else if (SMSDetails.sendSuccess && !SMSDetails.verified) {
            return (
                <form className="ui form">
                    <i className="key icon huge"></i>
                    <p>Looks like you're new - Welcome!</p>
                    <p>We just sent a 6-digit code to for security purposes</p>
                    <input
                        className="ui input"
                        type="text"
                        placeholder="Enter code here"
                        onChange={(e) => {
                            setSMSDetails({...SMSDetails, verifyCode: e.currentTarget.value})
                        }}
                        ></input>
                </form>
            )
        } else if (SMSDetails.verified) {
            return (
                <form className="ui form">
                    <i className="check circle icon green massive"></i>
                    <p>We just sent a confirmation of your current lineup.
                        Look out for a follow-up this Thursday at 5PM</p>
                </form>
            )}
    }

    const renderLookUpFormContent = () => {

        if (findRoster.rostersRetrieved && findRoster.rostersRetrieved.length > 0) {
            return (
                <div id="existingRosterList">
                    <h3>Please choose a roster to edit:</h3>
                    {findRoster.rostersRetrieved.map(roster => {
                        return (
                            <button className="ui button primary fluid large"
                                onClick={() => {
                                    setRosterDetails(JSON.parse(roster.parameters))
                                    let players = fullPlayerList.filter(player => roster.players.includes(player.systemId))
                                    setCurrentRoster({...currentRoster, Total: players, name: roster.name})
                                    setStartPage(false)
                                    setFindRoster({...findRoster, showForm: false})
                                }}
                            >
                                {roster.name}
                            </button>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <form className="ui form">
                    <p>Please enter your number below and we'll find your rosters</p>
                    <input
                        style={{"fontSize": "1.15rem"}}
                        type="text"
                        onChange={e => setFindRoster({findRoster, sendNumber: e.currentTarget.value})}
                    >
                    </input>
                </form>
            )
        }
    }

    useEffect(() => {
        currentRoster.Total.map(player => modifyRoster(player, "add"))
    }, [findRoster.showForm])
        
        const getRostersFromServer = async (e) => {
        
            setLoading(true)

            try {
                let SMSForm = new FormData()
                SMSForm.append('number', findRoster.sendNumber)
    
                let fetchResults = await fetch("https://fflo-server.herokuapp.com/players/getRosters", {
                    method: 'POST',
                    body: SMSForm
                })
                
                let resultsJson = await fetchResults.json()
    
                if (resultsJson == "error") {
                    throw "invalid number"
                }

                let rostersToAdd = JSON.parse(resultsJson).map(roster => {
                        return {name: roster.fields.name, players: roster.fields.players, parameters: roster.fields.parameters}})
                setFindRoster({...findRoster, rostersRetrieved: rostersToAdd})
                setLoading(false)

            } catch(e) {
                setHasError({...hasError, generalError: true})
                setLoading(false)
                console.warn(e)
            }

    }

    const renderSMSForm = () => {

        return (
            <Modal
                closeIcon
                onClose={() => {
                    setHasError({...hasError, duplicateError: false})
                    setSMSDetails({...SMSDetails, showForm: false})}}
                onOpen={() => setSMSDetails({...SMSDetails, showForm: true})}
                open={SMSDetails.showForm}
                trigger={<button className="ui button huge fluid positive">Set up reminder!</button>}
                size="tiny"
            >
                <Modal.Header>
                    {SMSDetails.verified ? <h2>Good To Go!</h2> : <h2>Set Up Text Reminder</h2>}
                </Modal.Header>
                    <Modal.Content>
                            <Modal.Description>
                                {hasError.duplicateError ? renderErrorMessage("Oops! You've already used that roster name") : renderSMSFormContent()}
                            </Modal.Description>
                            <Modal.Actions
                            style={{"display": SMSDetails.verified || hasError.duplicateError ? "none" : "block"}}>
                            <button className="ui large button fluid positive"
                                onClick={(e) => {
                                    !SMSDetails.initialSend ? handleCode(e) : handleCode(e, 'verify')
                                }}
                            >Send</button>            
                            </Modal.Actions>
                    </Modal.Content>
            </Modal>)

    }

    const renderLookupForm = () => {
        return (
            <Modal
                closeIcon
                size="tiny"
                open={findRoster.showForm}
                onClose={() => {setFindRoster({...findRoster, showForm: false})
                    setHasError(false)
                }}
                onOpen={() => setFindRoster({...findRoster, showForm: true})}
            >
                <Modal.Header>
                    {!findRoster.rostersRetrieved || findRoster.rostersRetrieved.length == 0 ? 
                    <span>Find Existing Rosters</span> : <span>Success!<i className="check circle icon green"></i></span>}
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                    {loading ? renderLoadingGraphic() : hasError.generalError ? renderErrorMessage("No rosters for that phone number!") 
                        : renderLookUpFormContent()}
                    </Modal.Description>
                    <Modal.Actions
                        style={{"display": (!findRoster.rostersRetrieved || findRoster.rostersRetrieved.length == 0) && !hasError.generalError ? "block" : "none"}}
                    >
                        <button className="ui large button positive fluid"
                            onClick={e => getRostersFromServer(e)}
                        >Send
                        </button>
                    </Modal.Actions>
                </Modal.Content>

            </Modal>
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
              closeIcon
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
                                            style={{"backgroundColor": leagueType === rosterDetails.type ? "#21ba45" : "" }}
                                            onClick = {e => {
                                                let newDetails = {...rosterDetails, type: leagueType}
                                                setRosterDetails(newDetails)}
                                            }>{leagueType}</button>
                                        )
                                    })}
                                    </div>
                                </div> )
                        } 
                        return (
                            <div className="row">
                                <div className="column four wide">
                                    {detail}
                                </div>
                                <div className="column twelve wide">
                                    <input
                                        style={{"fontSize": "1.15rem"}}
                                        type="text"
                                        value = {detail === "name" ? currentRoster.name : rosterDetails[`${detail}`]}
                                        onChange={(e) => {
                                            let newDetails = detail === "name" ? {...currentRoster, name: e.currentTarget.value} :
                                            {...rosterDetails, [detail]: e.currentTarget.value}
                                            detail === "name" ? setCurrentRoster(newDetails) : setRosterDetails(newDetails)
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
                <button className="ui button large fluid positive" 
                    onClick={() => {
                        let totalPlayers = allPositions.reduce((total, pos) => { return total + parseInt(rosterDetails[`${pos}`])}, 0)
                        setRosterDetails({...rosterDetails, Total: totalPlayers})
                        setShowRosterSelect(false)}}
                        >
                  Save Details
                </button>
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
        
        console.log(newRoster.Total)
        console.log(rosterDetails.Total)

        if (action === "add") {
            if (!newRoster.Total.includes(currentPlayer) && newRoster.Total.length <= rosterDetails.Total - 1) {
                newRoster.Total.push(currentPlayer)
            }
        } else {
            newRoster.Total = newRoster.Total.filter(player => player !== currentPlayer)
        }    
        
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

    const renderCardContent = (player, contentType) => {

        if (currentRoster.Total.length >= rosterDetails.Total && player.id === currentSelected) {
            return contentType === "text" ? <div id="addedGraphic">Roster already full</div> : "lightcoral"
        } else if (player.id === currentSelected) {
            return contentType === "text" ? <div id="addedGraphic">Added to roster!</div> : "lightgreen"
        } else if (currentRoster.Total.includes(player) && player.id !== currentSelected) {
            return contentType === "text" ? <div id="addedGraphic">Already in roster</div> : "#FFFFBA"
        } else {
            return contentType === "text" ? <div>{player.position} {player.team}</div> : ''
        }
    }

    /*
    old 
    style={{"backgroundColor": player.id === currentSelected ? "lightgreen" : 
                        currentRoster.Total.includes(player) ? "#FFFFBA" :
                        '' }}
    {player.id === currentSelected ? <div id="addedGraphic">Added to roster!</div> : 
                                currentRoster.Total.includes(player) ? <div>Already in roster</div> : <div>{player.position} {player.team}</div>}
    
    */

    const renderPlayerCard = (player, location="mainSearch") => {
        if (location==="mainSearch") {
            return (
                <div>
                    <div className="playerSearchProfile"
                        style={{"backgroundColor": renderCardContent(player, "color")}}
                        onClick={e => {
                            if (currentRoster.Total.includes(player)) {
                                return}
                            modifyRoster(player, 'add')
                            setCurrentSelected(player.id)
                            }}
                        //only for desktop
                        onMouseEnter={e => window.screen.width > 400 && e.currentTarget.style.backgroundColor === '' 
                        ? e.currentTarget.style.backgroundColor = "gainsboro" : ''}
                        onMouseLeave={e => player.id !== currentSelected && e.currentTarget.style.backgroundColor === "gainsboro" 
                        ? e.currentTarget.style.backgroundColor = "" : "lightgreen"}
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
                                {renderCardContent(player, "text")}
                            </div>
                        </div>
                    </div>
                </div>
            )   
        } else {
            return (
                <div className="ui segment raised"
                onMouseEnter={e => window.screen.width > 400 ? e.currentTarget.style.backgroundColor = "gainsboro" : ''}
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
                <h3>Loading</h3>
            </div>
        )
    }

    
    const resetQuestion = () => {
        return (
            <Modal
                open={showResetConfirm}
                onClose={() => {
                    setShowResetConfirm(false)
                }}
            >
                <Modal.Header>
                    Reset Confirm
                    <i className="times icon"
                        onClick={() => setShowResetConfirm(false)}
                    ></i>
                </Modal.Header>
                <Modal.Description
                id="resetConfirmDescription">
                    <p>Are you sure you want to delete your added details?</p>
                </Modal.Description>
                <Modal.Actions>
                    <button className="ui positive button medium"
                        onClick={() => {
                                if (startPage) {
                                    setStartPage(false)
                                } else {
                                setAddedPlayerDetails(addedPlayerDetailsStart)
                                setRosterDetails(rosterDetailsStart)
                                setCurrentRoster(currentRosterStart)
                                setShowResetConfirm(false)
                                }
                        }}
                        >Yes</button>
                    <button className="ui negative button medium"
                        onClick={() => 
                            setShowResetConfirm(false)}
                    >No</button>
                </Modal.Actions>
            </Modal>
        )
    }

    const sidebarMenu = () => {
    
        return (
          <div>
              <div id="sidebarIcon">
                  <i className="bars icon large"
                  onClick={() => setShowMenu(!showMenu)}></i>
              </div>
              <div
                className ={showMenu ? "visibleSidebar" : "hiddenSidebar"}
                >
                <p onClick={() => {
                    setShowMenu(!showMenu)
                    startPage ? setStartPage(false) : setShowResetConfirm(true)
                }}
                >
                   <i className="icon football ball"></i>Create New
                </p>
                <p
                    onClick={() => {
                        setShowMenu(!showMenu)
                        setHasError({...hasError, generalError: false})
                        setFindRoster({...findRoster, showForm: true})}}
                >
                    <i className="icon football ball"></i>Edit Existing
                </p>
                {renderAboutModal()}
              </div>
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
                        id="positionCounter"
                        style={{"backgroundColor": addedPlayerDetails[`${pos}`] === parseInt(rosterDetails[`${pos}`]) ? "#dfd" : "white"}}
                        >
                                <h2>{pos}<i className="check circle icon green"
                                style={{"display": addedPlayerDetails[`${pos}`] === parseInt(rosterDetails[`${pos}`]) ? "inline-block" : "none"}}
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
            {startPage ? '' : sidebarMenu()}
            {resetQuestion()}
            {renderLookupForm()}
            <div className="nav">
                <h1>FFLR</h1>
            </div>
            <div className="ui text container raised segment"
            onClick={() => setShowMenu(false)}>
                { startPage ? showStartPage() : 
                <div className="ui two column grid stackable"
                    id="playerSearch">
                    <div className="column nine wide fullList">
                        <div>   
                            <div>
                                <h2
                                style={{"marginBottom": "1vh", "textAlign": "center"}}
                                >Build/Edit Roster</h2>
                                {allPositions.every(pos => parseInt(rosterDetails[`${pos}`]) === addedPlayerDetails[`${pos}`]) ? 
                                <div className="ui raised segment" id="successIndicator">
                                    <h2>All positions filled!<i className="check circle icon green large"></i></h2>
                                   {renderSMSForm()}
                                </div> : 
                                '' }
                            </div>
                                {renderInputForm()}
                                <div id="playerListHeader">
                                    <h3>All Players</h3>
                                    {renderFilter()}
                                </div>
                                {loading ? renderLoadingGraphic() : hasError.generalError ? renderErrorMessage() : renderPlayerList()}
                        </div>
                        <div id="listSpacer" style={{"display": hasError.generalError ? "none" : "block"}}>
                            {loading ? '' : <p>Click on a player to add</p>}
                        </div>
                    </div>
                    <div className="column seven wide">
                        <div id="searchOptions">
                            <div><h3>{currentRoster.name}</h3></div>
                            <div>{renderRosterSelect()}</div>
                            <div>{addedPlayerDetails.Total} of {rosterDetails.Total} added</div>
                            {window.screen.width < 400 && 
                                allPositions.every(pos => parseInt(rosterDetails[`${pos}`]) === addedPlayerDetails[`${pos}`]) 
                                ? <button className="ui small button positive"
                                        onClick={() => {setSMSDetails({...SMSDetails, showForm: true})}}>
                                            Set up reminder </button> : ''}
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
