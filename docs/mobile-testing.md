# Mobile Testing Guide

## Testing with Secure HTTPS (Required for Camera Access)

The camera API requires HTTPS when accessing from mobile devices. We use Tailscale to provide secure HTTPS access for development.

### Prerequisites

1. Install [Tailscale](https://tailscale.com/) on your development machine
2. Join your Tailscale network
3. Create a `.env` file from `.env.example` and set your Tailscale domain

### Setup Steps

1. Start your Next.js development server:

   ```bash
   npm run dev
   ```

2. Enable Tailscale HTTPS serving:

   ```bash
   tailscale serve --bg http://localhost:3000
   ```

3. Access your app via the Tailscale HTTPS URL:
   ```
   https://your-machine-name.tailXXXX.ts.net
   ```

### Stopping the Service

To stop serving over HTTPS:

```bash
tailscale serve --https=443 off
```

### Troubleshooting

- If camera access is denied, ensure you're accessing the site via HTTPS through your Tailscale domain
- Make sure your mobile device is connected to the same Tailscale network
- Check browser permissions and ensure camera access is allowed
