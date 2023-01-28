import React, { useEffect, useState } from 'react';
import axios from 'axios';



const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios
        .get("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50")
        .then(r => console.log(r))

    // setArtists(data.artists.items)
}

export default function Playlist() {
    return (
        <form onSubmit={searchArtists}>
            <input type="text" /*onChange={e => setSearchKey(e.target.value)}*//>
            <button type={"submit"}>Search</button>
        </form>
    )
}



    