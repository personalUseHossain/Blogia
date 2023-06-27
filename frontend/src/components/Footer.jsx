import React from "react";
import "../css/Footer.css";

export default function Footer() {
  return (
    <>
      <footer>
        <div class="content">
          <div class="left box">
            <div class="upper">
              <div class="topic">Blogia</div>
              <p>
                Curiosity-driven blog platform. Engage with captivating
                articles, join our passionate community
              </p>
            </div>
            <div class="lower">
              <div class="topic">Contact Us</div>
              <div class="phone">
                <a href="#">
                  <i class="fas fa-phone-volume"></i>+088 01611822501
                </a>
              </div>
              <div class="email">
                <a href="#">
                  <i class="fas fa-envelope"></i>personal.mdhossain@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div class="middle box"></div>
          <div class="right box">
            <div class="topic">Subscribe us</div>
            <form action="#">
              <input type="text" placeholder="Enter email address" />
              <input type="submit" name="" value="Send" />
              <div class="media-icons">
                <a href="#">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i class="fab fa-youtube"></i>
                </a>
                <a href="#">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div class="bottom">
          <p>
            Copyright © 2020 <a href="#">Blogia</a> All rights reserved
          </p>
        </div>
      </footer>
    </>
  );
}
