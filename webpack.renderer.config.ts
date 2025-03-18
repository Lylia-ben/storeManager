/* eslint-disable @typescript-eslint/no-var-requires */
import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
// eslint-disable-next-line import/default
import CopyPlugin from "copy-webpack-plugin";

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/i, // Load images
    type: 'asset/resource', // Webpack will copy images to dist/assets/
  },
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins, // Include imported plugins if relevant
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }, // Copy assets to dist/assets
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
