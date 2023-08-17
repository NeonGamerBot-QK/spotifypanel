window.onload = () => {
  let status_info = {};
  const pauseBtn = document.getElementById("pause");
  const nextBtn = document.getElementById("next");
  const previousBtn = document.getElementById("previous");
  const volumeUpBtn = document.getElementById("volumeUp");
  const volumeDownBtn = document.getElementById("volumeDown");
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  const tray = document.getElementById("tray");
  if (!localStorage.getItem("password")) {
    tray.classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    pauseBtn.disabled = true;
    nextBtn.disabled = true;
    previousBtn.disabled = true;
    volumeUpBtn.disabled = true;
    volumeDownBtn.disabled = true;
    shuffleBtn.disabled = true;
    repeatBtn.disabled = true;
  }
  pauseBtn.onclick = () => {
    fetchAuthApi("./api/pause", {
      method: "POST"
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };
  nextBtn.onclick = () => {
    fetchAuthApi("./api/next", {
      method: "POST"
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };
  previousBtn.onclick = () => {
    fetchAuthApi("./api/previous", {
      method: "POST"
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };
  volumeUpBtn.onclick = () => {
    fetchAuthApi("./api/volume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ volume: "up" })
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };
  volumeDownBtn.onclick = () => {
    fetchAuthApi("./api/volume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ volume: "down" })
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };
  shuffleBtn.onclick = () => {
    fetchAuthApi("./api/shuffle", {
      method: "POST"
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };

  repeatBtn.onclick = () => {
    fetchAuthApi("./api/repeat", {
      method: "POST"
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
      });
  };

  document
    .getElementById("progress_bar")
    .addEventListener("click", function(e) {
      var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop, // or e.offsetY
        clickedValue = Math.round(x * this.max / this.offsetWidth);

      // console.log(clickedValue);
      fetchAuthApi("./api/seek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ seek: clickedValue })
      });
    });

  const fetchAuthApi = (url, ops) => {
    if (!localStorage.getItem("password")) {
      // alert("Not Authenticated")
      return;
    }
    return fetch(url, {
      ...ops,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("password")
      }
    });
  };
  const spotifyShareButton = document.getElementById("spotifyShareButton");
  const spotifyShareButton2 = document.getElementById("spotifyShareButton2");
  setInterval(() => {
    fetch("./api/status").then(r => r.json()).then(r => {
      // console.log(r)
      document.getElementById("songName").innerHTML = r.songName;
      document.getElementById(
        "info"
      ).innerHTML = `by ${r.artist} (${r.timestamp}) `;
      document.title = `Spotify Status: ${r.songName} by ${r.artist} (${r.timestamp})`;
      status_info.info = r;
      // calculate seconds (idk how)
      const seconds = r.timestamp
        .split("/")[0]
        .split(":")
        .reduce((acc, cur, i) => {
          if (i == 0) return acc + parseInt(cur) * 60;
          else return acc + parseInt(cur);
        }, 0);
      const duration = r.timestamp
        .split("/")[1]
        .split(":")
        .reduce((acc, cur, i) => {
          if (i == 0) return acc + parseInt(cur) * 60;
          else return acc + parseInt(cur);
        }, 0);
      // console.log(seconds, duration, duration - seconds)
      document.getElementById("progress_bar").setAttribute("value", seconds);
      document.getElementById("progress_bar").setAttribute("max", duration);
    });
  }, 900);
  setInterval(() => {
    fetch("./api/online_info").then(r => r.json()).then(r => {
      console.log(r);

      status_info.oinfo = r;
      if (document.getElementById("icon").src !== r.thumbnail_url)
        document.getElementById("icon").src = r.thumbnail_url;
    });
    fetch("./api/share").then(r => r.json()).then(r => {
      // console.log(r)
      // document.getElementById('songName').innerHTML = r.songName
      // document.getElementById('info').innerHTML = `by ${r.artist} (${r.timestamp}) `
      status_info.share = r;

      spotifyShareButton.disabled = false;
      spotifyShareButton2.disabled = false;
    });
  }, 3_000);

  spotifyShareButton.onclick = () => {
    // console.log(status_info)
    if (status_info.share) window.open(status_info.share.url);
  };

  spotifyShareButton2.onclick = () => {
    // console.log(status_info)
    // open URI in ur window
    if (status_info.share) window.open(status_info.share.uri, "_self");
  };
  window.onkeydown = e => {
    console.debug(e.key);
    // if(window.)
    if (e.key == " ") {
      fetchAuthApi("./api/pause", {
        method: "POST"
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "ArrowRight") {
      fetchAuthApi("./api/next", {
        method: "POST"
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "ArrowLeft") {
      fetchAuthApi("./api/previous", {
        method: "POST"
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "ArrowUp") {
      fetchAuthApi("./api/volume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ volume: "up" })
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "ArrowDown") {
      fetchAuthApi("./api/volume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ volume: "down" })
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "r") {
      fetchAuthApi("./api/repeat", {
        method: "POST"
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    } else if (e.key == "s") {
      fetchAuthApi("./api/shuffle", {
        method: "POST"
      })
        .then(r => r.json())
        .then(r => {
          console.log(r);
        });
    }
  };
  document.getElementById("submit_password").onclick = () => {
    handleAuth(document.getElementById("password").value);
  };

  function handleAuth(password) {
    fetch("./api/auth", {
      // method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: password
      }
    })
      .then(r => r.json())
      .then(r => {
        if (r.message === "OK") {
          alert("Authenticated");
          localStorage.setItem("password", password);
          tray.classList.remove("hidden");
          document.getElementById("login").classList.add("hidden");

          pauseBtn.disabled = false;
          nextBtn.disabled = false;
          previousBtn.disabled = false;
          volumeUpBtn.disabled = false;
          volumeDownBtn.disabled = false;
          shuffleBtn.disabled = false;
          repeatBtn.disabled = false;
        } else {
          alert("Incorrect username or password");
        }
      });
  }
};
