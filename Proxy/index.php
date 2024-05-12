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

    <div class="select">
        <label for="videoSource"></label><select id="videoSource"></select>
    </div>
      <video id="videoElement" width="950" height="700" playsinline autoplay style="position: absolute;"></video>     
      <canvas id="canvasElement" width="950" height="700" style="background: red;" ng-show="canvasDrawer"></canvas>

      <button id="showVideo" class="btn btn-primary" style=" position: absolute; left: 915px;"><span class="glyphicon glyphicon-camera"></span></button> 

      <table class="table-bordered"  style=" position: absolute; left: 960px; width:50%;">
        <thead>
         
          <tr>
            <th scope="col" colspan=1>
              <button type="button" class="btn btn-primary" ng-click="startProcess()" ng-disabled="startProcessBtnDisabled">Start Process</button>
              <button type="button" class="btn btn-secondary" ng-click="mockDetection()" ng-disabled=false>Mock AI</button>
            </th>
            <th scope="col" colspan=1 style="background-color: {{startProcessStatusColorIndicator}}; color: white">
              <h4>{{ startProcessStatus }}</h4>
            </th>
            <th scope="col" colspan=1>
                <h4>Money Loaded<h4>
            </th>
            <th scope="col" colspan=1 style="background-color: {{loadedStatusColorIndicator}}; color: white">
                <h4>{{ loadedStatus }}<h4>
            </th>
          </tr>
          <tr>
            <th scope="col" colspan=2>
                <h4>Stage Process<h4>
            </th>
            <th scope="col" colspan=1>
                <h4>{{ stageStepStatusType }}<h4>
            </th>
            <th scope="col" colspan=1 style="background-color: {{stageStepStatusColorIndicator}}; color: white">
                <h4>{{ stageStepStatus }}<h4>
            </th>
          </tr>
          <tr>
            <th scope="col" colspan=4>
                <h4 align="center">Cash Breakdown<h4>
            </th>
          </tr>
          <tr>
            <th scope="col" colspan=2 width="100px"><h4>Domination</h4></th>
            <th scope="col"><h4>Quantity</h4></th>
            <th scope="col"><h4>Total</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 20</h4></th>
            <th scope="col"><h4>{{ bill_20_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_20_O_Quantity * bill_20_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 50</h4></th>
            <th scope="col"><h4>{{ bill_50_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_50_O_Quantity * bill_50_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 100</h4></th>
            <th scope="col"><h4>{{ bill_100_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_100_O_Quantity * bill_100_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 200</h4></th>
            <th scope="col"><h4>{{ bill_200_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_200_O_Quantity * bill_200_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 500</h4></th>
            <th scope="col"><h4>{{ bill_500_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_500_O_Quantity * bill_500_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Php 1000</h4></th>
            <th scope="col"><h4>{{ bill_1000_O_Quantity }}</h4></th>
            <th scope="col"><h4>{{ bill_1000_O_Quantity * bill_1000_O_Bill }}</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=2><h4>Fake</h4></th>
            <th scope="col"><h4>{{ bill_Fake_Quantity }}</h4></th>
            <th scope="col"><h4>-</h4></th>
          </tr>
          <tr>
            <th scope="col" colspan=3><h4>Grand Total</h4></th>
            <th scope="col"><h4>{{ grand_total_value }}</h4></th>
          </tr>
        </thead>
        <tbody>


          <!-- <tr ng-repeat='x in list_detected'>
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
              <li><h4>{{ x.description }}</h4></li>
            </ul>
          </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
  
</div>

<script src="js/main.js"></script>
<script src="js/angular.min.js"></script>
<script src="js/angular-base64.min.js"></script>


<script src="js/renderer.js"></script>
<script src="js/jquery-3.2.1.slim.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/mqttws31.min.js"></script>


</body>
</html>
