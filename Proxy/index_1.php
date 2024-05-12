<!DOCTYPE html>
<!--
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
-->
<html ng-app="ai">
<head>

    <meta charset="utf-8">
    <meta name="description" content="WebRTC code samples">
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
    <meta itemprop="description" content="Client-side WebRTC code samples">
    <meta itemprop="image" content="../../../images/webrtc-icon-192x192.png">
    <meta itemprop="name" content="WebRTC code samples">
    <meta name="mobile-web-app-capable" content="yes">
    <meta id="theme-color" name="theme-color" content="#ffffff">

    <base target="_blank">

    <title>Scanner</title>

    <link rel="stylesheet" href="css/bootstrap.min.css">
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>



</head>

<body ng-controller="ai_controller">

    <script src="js/object-detection@0.0.8"></script>
    <script src="js/hls.js@0.12.4"></script>
    <script src="js/adapter-latest.js"></script>


<div id="container">

  <div class="row">
    <div class="col-md-4 col-xl-3">          
      <video id="gum-local" width="950" height="700" autoplay playsinline  style="position: absolute;"></video>
      <canvas id="canvas" width="950" height="700" style="position: absolute;"></canvas>

      <button id="showVideo" class="btn btn-primary" style=" position: absolute; left: 915px;"><span class="glyphicon glyphicon-camera"></span></button> 

      <table class="table table-sm table-bordered"  style=" position: absolute; left: 960px;">
        <thead>
          <tr>
          <th scope="col"><h2>Class</h2></th>
          <th scope="col"><h2>Score</h2></th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat='x in list_detected'>
          <td><h3>{{ x.class }}</h3></td>
          <td><h3>{{ x.score | number : 2 }}</h3></td>
          </tr>
          <tr>
          <th scope="col" colspan=2><h2>Remedes</h2></th>
          </tr>
          <tr ng-repeat='x in list_remedes'>
          <td colspan=2><h3>{{ x.class }}</h3></td>
          </tr>
          <tr ng-repeat='x in list_solution'>          
          <td colspan=2>    
            <p><h4>{{ x.remede }}</h4></p>
            <ul>
              <li><h5>{{ x.description }}</h5></li>
            </ul>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</div>

<script src="js/main.js"></script>
<script src="js/angular.min.js"></script>

<script src="js/renderer.js"></script>
<script src="js/jquery-3.2.1.slim.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>


</body>
</html>
