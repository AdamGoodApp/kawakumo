import path from "node:path";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	vite: () => ({
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./"),
			},
		},
	}),
});
