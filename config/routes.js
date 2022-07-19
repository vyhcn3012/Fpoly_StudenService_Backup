'use strict';
const express = require( 'express' );
const path = require( 'path' );
const { HttpError } = require( '../system/helpers/HttpError' );
const apiRoutes = require( '../system/routes' );
const cpanelRoutes = require( '../system/routes/cpanel' );

module.exports.setRoutes = ( app ) => {

    /**
     * Application Root Route.
     * Set the Welcome message or send a static html or use a view engine.
     */
    // app.get( '/', ( req, res ) => {
    //     res.send( 'Welcome to the APP' );
    // } );

    /**
     * Cpanel Route.
     * All the Cpanel will start with "/cpanel/[MODULE_ROUTE]"
     */
     app.use( '/', cpanelRoutes );


    /**
     * API Route.
     * All the API will start with "/api/[MODULE_ROUTE]"
     */
    app.use( '/api', apiRoutes );

    /**
     * Serving Static files from uploads directory.
     * Currently Media module is uploading files into this directory.
     */
    // app.use( '/uploads', express.static( path.join( __dirname, '../uploads' ) ) );

    /**
     * If No route matches. Send user a 404 page
     */
    // app.use( '/*', ( req, res ) => {
    //     const error = new Error( 'Requested path does not exist.' );

    //     error.statusCode = 404;
    //     res.status( error.statusCode ).json( new HttpError( error ) );
    // } );
};
