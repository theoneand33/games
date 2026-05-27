#!/bin/bash
GAMES_DIR="/home/noah/unblocked-games/src/pages/games"

GAMES=(
  "Fireboy and Watergirl|fireboy-and-watergirl|fireboy-watergirl.swf"
  "The World's Hardest Game|worlds-hardest-game|worldshardestgame.swf"
  "Duck Life|duck-life|ducklife.swf"
  "Crush the Castle|crush-the-castle|crushthecastle.swf"
  "Burrito Bison|burrito-bison|burritobison.swf"
  "Learn to Fly 3|learn-to-fly-3|learntofly3.swf"
  "Bubble Trouble|bubble-trouble|bubbletrouble.swf"
  "Achievement Unlocked|achievement-unlocked|achievementunlocked.swf"
  "Interactive Buddy|interactive-buddy|interactivebuddy.swf"
)

for GAME_INFO in "${GAMES[@]}"; do
  IFS='|' read -r GAME_NAME GAME_PATH SWF_FILE <<< "$GAME_INFO"
  
  cat > "${GAMES_DIR}/${GAME_PATH}.astro" << ASTRO
---
const Game = "${GAME_NAME}";
import Layout from "../../layout/layout.astro";
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Play ${GAME_NAME} superfun online. - superfun and ready to play!"
    />
    <title>{Game}</title>
    <script defer src="/_vercel/insights/script.js"></script>
  </head>
  <Layout Game={Game}>
    <div style="text-align: center">
      <div
        id="container"
        style="border: #ccc 0px solid; height: 100%; width: 100%"
      >
      </div>
      <script src="/ruffle/ruffle.js" is:inline></script>
      <script data-astro-rerun is:inline>
        window.RufflePlayer = window.RufflePlayer || {};
        (function() {
          var container = document.getElementById("container");
          if (!container) return;
          var ruffle = window.RufflePlayer.newest();
          if (!ruffle) return;
          container.innerHTML = '';
          var player = ruffle.createPlayer();
          container.appendChild(player);
          player.style.height = "96vh";
          player.style.width = "98vw";
          player.load("/flash/${SWF_FILE}");
        })();
      </script>
    </div>

    <script type="text/javascript">
      atOptions = {
        key: "1cc5f63f55fc28b4c469b5e4e2f1a79d",
        format: "iframe",
        height: 250,
        width: 300,
        params: {},
      };
    </script>
    
  </Layout>

</html>
ASTRO

  echo "Created ${GAME_PATH}.astro"
done
