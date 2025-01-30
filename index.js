const getData = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

const load = async () => {
  const dataOdds = await getData('./data/Odds.json');
  const dataMatchGame = await getData('./data/MatchGame.json');
  const dataFileFromMarketGames = await getData( './data/FileFromMarketGames.json');

  const resultsTeams =(dataOdds.data
      .filter(
        odd => dataFileFromMarketGames
        .data.some(marketGame => (
          (marketGame.id === odd.market_id) &&
          odd.status === "TDM"|| odd.status === "OP" || odd.status === "TD")
          && (odd.odd_origin === "PRE" || odd.odd_origin === "LIVE"
        )&& ( marketGame.videogame === "csgo"))
      )
      .map(odd =>{
        const marketGame = dataFileFromMarketGames
        .data.find(game => (game.id === odd.market_id));

        const updateSelections = marketGame.selections
        .map(selection => {
          const {
            id,
            odd_quota, 
            status, 
            odd_origin} = dataOdds.data
            .find(odd => odd.selection_id === selection.id)
          return {
            id,
            name : selection.name,
            odd_quota : odd_quota,
            status,
            odd_origin
          }
        })

        return {
          id : marketGame.id,
          name : marketGame.name,
          videogame: marketGame.videogame,
          selection: updateSelections,
        }
      })
    )
  
  console.log(resultsTeams)

  const mapGame = new Map()
  resultsTeams.forEach(game => {
    const key = game.id;
    const value = game;
    mapGame.set(key, value);
  });
    
  console.log(Array.from(mapGame.values()))
}

load();




