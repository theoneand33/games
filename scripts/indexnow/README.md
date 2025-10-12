# IndexNow Integration

This directory contains the IndexNow integration for the unblocked-games project. IndexNow is a protocol that allows websites to notify search engines about changes to their content immediately.

## Overview

The IndexNow integration includes:
- API key hosted at `/public/a574a450817f42a183489d2ad98b18ac.txt`
- Automated URL submission script
- Support for bulk and single URL submissions

## Configuration

- **Domain**: `unblocked-games.vercel.app`
- **API Key**: `a574a450817f42a183489d2ad98b18ac`
- **Key Location**: `https://unblocked-games.vercel.app/a574a450817f42a183489d2ad98b18ac.txt`
- **IndexNow API**: `https://api.indexnow.org/IndexNow`

## Usage

### Submit All URLs

To submit all URLs from your sitemap to IndexNow:

```bash
npm run indexnow
```

### Update URLs from Sitemap

To automatically fetch the latest URLs from your sitemap and update the script:

```bash
pnpm run indexnow:update
```

This will:
1. Fetch your sitemap from `https://unblocked-games.vercel.app/sitemap.xml`
2. Extract all URLs from the sitemap
3. Update the `URLS` array in the submission script
4. Display the found URLs

### Submit Single URL

To submit a single URL:

```bash
pnpm run indexnow:single https://unblocked-games.vercel.app/games/new-game/
```

### Direct Script Usage

```bash
# Submit all URLs
node scripts/indexnow/submit-urls.js

# Submit single URL
node scripts/indexnow/submit-urls.js --single https://unblocked-games.vercel.app/games/new-game/

# Update from sitemap
node scripts/indexnow/update-from-sitemap.js
```

## Current URLs

The script will submit the following URLs:
- https://unblocked-games.vercel.app/
- https://unblocked-games.vercel.app/dmca/
- https://unblocked-games.vercel.app/games/bloonstd5/
- https://unblocked-games.vercel.app/games/doom/
- https://unblocked-games.vercel.app/games/geography-game/
- https://unblocked-games.vercel.app/games/geometry-dash/
- https://unblocked-games.vercel.app/games/gun-mayhem2/
- https://unblocked-games.vercel.app/games/happywheels/
- https://unblocked-games.vercel.app/games/hobo2/
- https://unblocked-games.vercel.app/games/hobo7/
- https://unblocked-games.vercel.app/games/madness-project-nexus/
- https://unblocked-games.vercel.app/games/minesweeper/
- https://unblocked-games.vercel.app/games/plants-vs-zombies/
- https://unblocked-games.vercel.app/games/riddle-school2/
- https://unblocked-games.vercel.app/games/riddle-school3/
- https://unblocked-games.vercel.app/games/riddle-school4/
- https://unblocked-games.vercel.app/games/riddle-school5/
- https://unblocked-games.vercel.app/games/supermarioflash/
- https://unblocked-games.vercel.app/games/tetris/
- https://unblocked-games.vercel.app/games/theimpossiblequiz2/
- https://unblocked-games.vercel.app/games/vex3/

## Response Codes

- **200**: URLs submitted successfully
- **400**: Invalid format
- **403**: Key not valid (key not found or key not in file)
- **422**: URLs don't belong to the host or key doesn't match schema
- **429**: Too Many Requests (potential spam)

## Verification

After submission, you can verify if your URLs are received by search engines using:
- Bing Webmaster Tools
- Other search engine webmaster tools that support IndexNow

## Best Practices

1. **Submit URLs when content changes**: Run the script when you add new games or update existing pages
2. **Don't over-submit**: IndexNow recommends submitting URLs only when content actually changes
3. **Monitor responses**: Check the response codes to ensure successful submissions
4. **Update URL list**: When you add new games to your sitemap, update the URLS array in the script

## Automation

You can automate IndexNow submissions by:
1. Adding the script to your CI/CD pipeline
2. Running it after successful deployments
3. Setting up a webhook to trigger submissions when content changes

Example CI/CD integration:
```yaml
# In your deployment script
pnpm run build
pnpm run indexnow:update  # Update URLs from sitemap first
pnpm run indexnow         # Then submit to IndexNow
pnpm run deploy
```

### Automated Workflow

For a complete automated workflow:
1. Update your sitemap when adding new games/pages
2. Run `pnpm run indexnow:update` to refresh the URL list
3. Run `pnpm run indexnow` to submit all URLs
4. Deploy your changes

This ensures IndexNow always has your latest URL structure.

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Ensure the API key file is accessible at the specified location
2. **422 Unprocessable Entity**: Verify all URLs belong to your domain
3. **Network Issues**: Check your internet connection and firewall settings

### Debug Mode

To debug issues, you can modify the script to add more verbose logging or test with a single URL first.

## Resources

- [IndexNow Documentation](https://www.indexnow.org/documentation)
- [IndexNow API Reference](https://www.indexnow.org/documentation)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)