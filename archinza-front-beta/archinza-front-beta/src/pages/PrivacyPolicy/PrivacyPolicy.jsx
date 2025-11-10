import React, { useEffect } from "react";
import "./privacypolicy.scss";
import MetaDecorator from "../../components/MetaDecorator/MetaDecorator";
import { homepageURL } from "../../components/helpers/constant-words";
import { Link } from "react-router-dom";
import FooterV2 from "../../components/FooterV2/FooterV2";
import useTheme from "../../components/useTheme/useTheme";

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="main_conatiner">
        {/* <OldHeader /> */}
        {/* <section className="privacy_sec1"> */}
        <MetaDecorator
          metaTitle="Privacy Policy"
          metaDesc="Privacy Policy"
          canonicalLink={window.location}
        />
        {/* </section> */}

        <section
          className={`privacy_sec2 ${
            theme === "dark" ? "dark_mode--theme-styles" : ""
          }`}
        >
          <div className="my_container">
            <div className="text_container">
              {/* <p className="desc">
                <strong>Effective Date</strong>: 19th July 2023
                <br />
                <br />
                <strong>Last updated on</strong>: 19th July 2023
              </p> */}
              <h2 className="main_heading">Privacy Policy</h2>
              <div className="desc">
                <p className="para">
                  {" "}
                  We, at ARCHINZA (<strong>“Archinza/ We/ Our”</strong>)
                  appreciate the trust and information entrusted upon us by you,
                  and seek to protect such information to the best extent
                  possible, and only use the information in a manner provided in
                  this Privacy Policy.
                </p>
                <p className="para">
                  {" "}
                  The Privacy Policy is to be read along with and is also
                  subject to Archinza Terms & Conditions available at (
                  <strong>“Terms & Conditions”</strong>), and comes into effect
                  from the date and time a user (
                  <strong>“User” or “ You”</strong>) registers with Archinza,
                  and accepts the Terms laid provided for.
                </p>
                <p className="para">
                  {" "}
                  Archinza Privacy Policy tells you how Archinza collects,
                  protects, uses, and shares your information in relation to the
                  services provided through the Website & its own or Third party
                  Bot (collectively, the <strong>“Service”</strong>), and your
                  choices about the collection and use of your information. By
                  using Archinza Service you understand and accept this privacy
                  policy along with any changes as may be made from time to time
                  and thereby expressly consent to Archinza collection, use and
                  disclosure of Personal Information (as defined below) in
                  accordance with this Privacy Policy.
                </p>
                <p className="para">
                  {" "}
                  This Privacy Policy explains how we, Archinza, collect,
                  process and use information of our users (hereinafter
                  addressed as “you”, “your”, “yourself”). We are the operator
                  of the website <Link to={homepageURL}>www.archinza.com</Link>,
                  all associated mobile application & third part API, and a
                  provider of a range of services thereto. We provide a platform
                  where we may list sellers and offers for local services and
                  goods which are made available by us or other professionals/
                  sellers/ Businesses/ Brands/ Students/ Firms/ Events
                  (collectively: <strong>“Archinza Pro(s)”</strong>). This
                  Privacy Policy applies to information that we collect through
                  our website, mobile application, electronic communications or
                  services (collectively, the <strong>“Site”</strong>).
                </p>
                <p className="para">
                  {" "}
                  We will routinely update this Privacy Policy to improve our
                  practices and to reflect new or different privacy practices,
                  such as when we add new services, functionality or features to
                  the Site.
                </p>
                <p className="para">
                  {" "}
                  By visiting this Website you agree to be bound by the terms
                  and conditions of this Privacy Policy. If you do not agree,
                  please do not use or access our Website.
                </p>
              </div>
              <h4 className="heading">
                Sensitive Personal Data and Information (SPDI)
              </h4>
              <div className="desc">
                <p className="para">
                  “The Information Technology Act, 2000” or “ITA, 2000”, was
                  notified on October 17, 2000. It is the law that deals with
                  cybercrime and electronic commerce in India.
                </p>
                <p className="para">
                  As per the IT Act 2000 (amended in 2008) the SPDI consists of
                  information relating to:
                </p>
                <ol className="roman_number">
                  <li>Personal Data (Email, Address)</li>
                  <li>Purchase / browsing history/ patterns</li>
                  <li>password; </li>
                  <li>
                    financial information such as Bank account or credit card or
                    debit card or other payment instrument details ;
                  </li>
                  <li>physical, physiological and mental health condition; </li>
                  <li>sexual orientation;</li>
                  <li>medical records and history; </li>
                  <li>Biometric information;</li>
                  <li>
                    any detail relating to the above clauses as provided to body
                    corporate for providing service and{" "}
                  </li>
                  <li>
                    any of the information received under above clauses by body
                    corporate for processing, stored or processed under lawful
                    contract or otherwise: provided that, any information that
                    is freely available or accessible in public domain or
                    furnished under the Right to Information Act, 2005 or any
                    other law for the time being in force shall not be regarded
                    as sensitive Personal Data or information for the purposes
                    of these rules.
                  </li>
                </ol>
              </div>
              <h4 className="heading">Ways in which we collect your data: </h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    Log Data: When you visit the platform, our servers
                    automatically record information that your browser sends (
                    <strong>“Log Data”</strong>). This Log Data may include
                    information such as your computer’s Internet Protocol (
                    <strong>“IP”</strong>) address, browser type, or the webpage
                    you were visiting before you came to Archinza services
                    through a hyperlink on that page, pages of Archinza platform
                    and services that you visit, the time spent on those pages,
                    information you search for on Archinza services, access
                    times and dates, and other statistics. Archinza use this
                    information to analyse trends, administer the site, , gather
                    broad demographic information for aggregate use, increase
                    user-friendliness and tailor Archinza services to better
                    suit your needs.
                  </li>
                  <li>
                    If you permit cookies on your browser, Archinza may receive
                    and store certain types of information known as “cookies”
                    when you access the Website.{" "}
                  </li>
                  <li>Communications between you and Archinza.</li>
                  <li>
                    Register, subscribe, create an Archinza Pro ( Student/
                    Professional/ Business/ Firm/ Event/ Seller/ Business) Page,
                    authorize the transfer of, or create an account with us;
                  </li>
                  <li>Open or respond to emails;</li>
                  <li>
                    Provide information to enroll or participate in programs/
                    polls/ surveys provided on behalf of, or together with other
                    Sellers, merchants, co-marketers, distributors, resellers
                    and other business partners, with your consent or as
                    necessary to provide services you have requested;
                  </li>
                  <li>Questions asked on the Chat rooms/ bots/ help page;</li>
                  <li>
                    Visit any page online that displays our ads or content;
                  </li>
                  <li>Purchase products or services on or through the Site;</li>
                  <li>
                    Interact or connect with or link to the Site via integrated
                    social networking tools; and
                  </li>
                  <li>Post comments to the Site.</li>
                </ol>
              </div>
              <h4 className="heading">Managing User Choices</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    You can manage the types of personal data you provide to us
                    and can limit how we communicate with you.
                  </li>
                  <li>
                    You can manage your email and notice preferences by logging
                    into your account through the Site or by adjusting the
                    settings in our mobile application.
                  </li>
                  <li>
                    You can also manage your Archinza Pro Page subscriptions by
                    following subscription management instructions contained in
                    any commercial emails that we send you.
                  </li>
                  <li>
                    You may update your subscription preferences at any time.
                    Please note that even if you decide not to subscribe to, or
                    to unsubscribe, from promotional email messages, we may
                    still need to contact you with important transactional
                    information related to your account and your purchases. For
                    example, even if you have unsubscribed from our promotional
                    email messages, we will still send you confirmations when
                    you make purchases on the Site.
                  </li>
                  <li>
                    You hereby consent to receive communications by SMS or calls
                    from{" "}
                    <Link to={homepageURL}>
                      <strong>Archinza.com</strong>
                    </Link>{" "}
                    or its affiliates, its partners or Archinza Pro(s) with
                    regard to the services provided by {""}
                    <Link to={homepageURL}>
                      <strong>Archinza.com</strong>
                    </Link>{" "}
                    or as facilitated by the {""}{" "}
                    <Link to={homepageURL}>
                      <strong>Archinza.com</strong>
                    </Link>{" "}
                    partners.
                  </li>
                  <li>
                    You may manage how your browser handles cookies by adjusting
                    its privacy and security settings. Browsers are different,
                    so refer to instructions related to your browser to learn
                    about cookie-related and other privacy and security settings
                    that may be available. Please refer to Paragraph 11 of this
                    Policy for information of Cookies for more information.
                  </li>
                  <li>
                    You may also manage how your mobile device and mobile
                    browser share information on and about your devices with us,
                    as well as how your mobile browser handles cookies by
                    adjusting the privacy and security settings on your mobile
                    device. Please refer to instructions provided by your mobile
                    service provider and the manufacturer of your device to
                    learn how to adjust your settings.
                  </li>
                  <li>
                    You may also manage the sharing of certain personal data
                    with us when you connect with us through social networking
                    platforms or applications. Please refer to Paragraph 9 below
                    and also the privacy policy and settings of the social
                    networking websites or applications to determine how you may
                    adjust our permissions and manage the interactivity between
                    us and your social networking account or your mobile device.
                  </li>
                  <li>
                    If you register for customized email newsletters containing
                    offers for local services and goods, we will work to make
                    information more relevant for you and customize newsletters
                    based on information you share with us, your location,
                    website browsing preferences (for example, through cookies),
                    browsing history or based on other attributes of your
                    relationship with us. You can reject and delete cookies and
                    unsubscribe from newsletters at any time by clicking links
                    in each newsletter you wish to unsubscribe from.
                  </li>
                  <li>
                    You can access, update, rectify, and delete your information
                    you provided to us in your profile by logging into your
                    account or contacting us through the help section at {""}
                    <Link to={homepageURL}>http://www.archinza.com</Link>
                  </li>
                  <li>
                    While we are ready to assist you in managing your
                    subscriptions, closing your account, and removing your
                    active profile, we cannot always delete records of past
                    interactions and transactions. For example, we may be
                    required to retain records relating to previous purchases or
                    reviews on the Site for financial reporting and compliance
                    reasons.
                  </li>
                </ol>
              </div>
              <h4 className="heading">Purpose of collecting the data:</h4>
              <div className="desc">
                <p className="para">
                  We process personal data for the following purposes:
                </p>
                <ol className="decimal_number">
                  <li>Operate, maintain and improve the Site;</li>
                  <li>
                    Provide you with personalized direct marketing initiatives
                    via email and direct marketing offers;
                  </li>
                  <li>
                    Facilitate and process orders – for example, for vouchers
                    and other goods and services;
                  </li>
                  <li>Facilitate contact to sellers on our site;</li>
                  <li>
                    Determine your eligibility for certain types of offers,
                    products or services that may be of interest to you, and
                    analyze advertising effectiveness;
                  </li>
                  <li>Answer your questions and respond to your requests;</li>
                  <li>
                    To establish and analyze individual and group profiles and
                    customer behavior;
                  </li>
                  <li>
                    Communicate and provide additional information that may be
                    of interest to you about us, the Sellers and our business
                    partners;
                  </li>
                  <li>
                    Send you reminders, technical notices, updates, security
                    alerts, support and administrative messages, service
                    bulletins, marketing messages, and requested information,
                    including on behalf of business partners;
                  </li>
                  <li>
                    Administer rewards, surveys, contests, or other promotional
                    activities or events;
                  </li>
                  <li>
                    Manage our everyday business needs, such as administration
                    of the Site, analytics, fraud prevention, and enforcement of
                    our corporate reporting obligations and Terms of Use or to
                    comply with the law;
                  </li>
                  <li>
                    Comply with our legal obligations, resolve disputes, and
                    enforce our agreements;
                  </li>
                  <li>
                    Allows you to sign up for special offers from merchants and
                    other business partners through the Site; and to
                  </li>
                  <li>
                    Enhance other information we have about you to help us
                    better understand you, determine your interests and provide
                    you with more relevant and compelling services.
                  </li>
                </ol>
              </div>
              <p className="note_text">
                {" "}
                PLEASE NOTE ARCHINZA IS NOT RESPONSIBLE FOR THE USE OF ANY
                PERSONAL INFORMATION YOU VOLUNTARILY DISCLOSE THROUGH A FORUM/
                CHAT ROOM/ THIRD PARTY CHAT MESSAGING OR OTHERWISE THROUGH THE
                SITE OR THE SERVICES.
              </p>
              <h4 className="heading">Disclosure of Information</h4>
              <div className="desc">
                <p className="para">
                  We are not in the business of selling or renting personal
                  data. We will not share your personal data, except in the
                  following manner:
                </p>
                <ol className="decimal_number">
                  <li>
                    with the Sellers, so they can sell and deliver to you and
                    provide such other ancillary services such as product
                    updates to serve you better;
                  </li>
                  <li>
                    to report or collect on payments owed to Sellers, merchants
                    or other business partners;
                  </li>
                  <li>
                    as necessary to perform contractual obligations towards you
                    with business partners to the extent you have purchased or
                    redeemed a archinza.com voucher, for services or goods
                    offered by a business partner or participated in an offer,
                    rewards, contest or other activity or program sponsored or
                    offered through us or the Sellers on behalf of a business
                    partner;
                  </li>
                  <li>
                    in case of a merger, acquisition or reorganization with a
                    purchaser of our company or all or substantially all of our
                    assets;
                  </li>
                  <li>
                    to comply with legal orders and government requests, or as
                    needed to support auditing, compliance;
                  </li>
                  <li>
                    to combat fraud or criminal activity, and to protect our
                    rights or those of our affiliates, business partners and
                    users, or as part of legal proceedings affecting {""}
                    <Link to={homepageURL}>archinza.com</Link>;
                  </li>
                  <li>
                    in response to a legal process, including to law enforcement
                    agencies, regulators, and courts; or
                  </li>
                  <li>
                    with your consent or as otherwise required or permitted by
                    law.
                  </li>
                  <li>
                    To provide insights on trends searched for on our platform,
                    with cumulative data of all users.
                  </li>
                </ol>
                <p className="para">
                  We encourage business partners to adopt and post privacy
                  policies. However, while we share personal data with business
                  partners only for the above-mentioned purposes, their
                  subsequent processing and use of personal data obtained
                  through archinza.com is governed by their own privacy policies
                  and practices and are not subject to our control.
                </p>
              </div>
              <h4 className="heading">Security of Personal Information</h4>
              <div className="desc">
                <p className="para">
                  We use strict security measures to ensure the security,
                  integrity and privacy of Your Personal Information and to
                  protect your Personal Information against unauthorized access
                  or unauthorized alteration, disclosure or destruction. For
                  this purpose, we have adopted internal reviews of the data
                  collection, storage and processing practices and security
                  measures, including offering the use of a secure server to
                  guard against unauthorized access to systems where we store
                  your personal data.{" "}
                </p>
                <p className="para">
                  The User is solely responsible for maintaining confidentiality
                  of the User’s password and User identification. Archinza
                  assumes no responsibility or liability for their improper use
                  of information relating to such usage of credit cards and/or
                  debit cards by the User, whether online or off-line. In case
                  of online transaction, the user’s bank account information,
                  credit card numbers will be used for billing and payment
                  purposes including but not limited to the use and disclosure
                  of such information to third parties as necessary to complete
                  such billing information. User’s credit-card/debit card
                  details are transacted upon secure sites of approved payment
                  gateways which are digitally under encryption.
                </p>
                <p className="para">
                  We shall, however, not be responsible for any breach of
                  security or for any actions of any third parties that receive
                  Your Personal Information. The Website is also linked to many
                  other sites and we are not/shall be not responsible for their
                  privacy policies or practices as it is beyond our control.
                  Archinza shall not be held responsible for use or misuse of
                  any information pertaining to or shared by the User with
                  relation to its services. The User will not hold Archinza
                  accountable for any issue related to data storage and/or
                  security.
                </p>
              </div>
              <h4 className="heading">Retention of Personal Data</h4>
              <div className="desc">
                All information (and copies thereof) collected by Archinza,
                including without limitation Personal Information, User Data,
                and other information related to your access and use of the
                services offered by Archinza, may be retained by Archinza for
                such period as necessary, including but not limited to, for
                purposes such as compliance with statutory or legal obligations,
                tax laws and potential evidentiary purposes and for other
                reasonable purposes such as to implement, administer, and manage
                your access and use of Archinza services, or resolution of any
                disputes.
              </div>
              <h4 className="heading">Social Site Features</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    The Site may contain connections to areas where you may be
                    able to publicly post information, communicate with others
                    such as review products and merchants, and otherwise submit
                    your own original content. Prior to posting in these areas,
                    please read our Terms of Use carefully. All the information
                    you post may be accessible to anyone with Internet access,
                    and any information you include in your posting may be read,
                    collected, and used by others.
                  </li>
                  <li>
                    Connecting through Social Networks: We offer social
                    networking users the opportunity to interact with friends
                    and to share on social networks. If you are logged into both
                    the Site and a social network, when you use the Site’s
                    social networking connection functions, you may connect your
                    social network account with your archinza.com account (this
                    may happen automatically, if the email addresses match). If
                    the email addresses do not match, we ask you if you want to
                    link them and you must validate that you control the
                    accounts. If you are already logged into the Site but not
                    logged into your social network site, when you use the
                    Site’s social network connection functions, you will be
                    prompted to enter your social network website credentials or
                    to sign up for the social network.
                  </li>
                  <li>
                    If you are not currently registered as a archinza.com user
                    and you use the Site’s social network/ chatroom/ bot
                    connection functions, you will first be asked to enter your
                    social network credentials and then be given the option to
                    register and join archinza.com. Once you register with us
                    and connect with the social network, you will be able to
                    automatically post recent archinza.com activity back to your
                    social network or chat room or bot. Please refer to the
                    privacy settings in your social network account to manage
                    the data that is shared through your account or our third
                    party API.
                  </li>
                  <li>
                    By using the Site’s social network connection function, you
                    will grant us permission to access all of the elements of
                    your social network profile information that you have made
                    available to be shared (as per the settings chosen by you in
                    your social network profile) and to use it in accordance
                    with the social network’s terms of use and this Privacy
                    Policy.
                  </li>
                </ol>
              </div>
              <h4 className="heading">Privacy Policies of Third Parties</h4>
              <div className="desc">
                <p className="para">
                  This Privacy Policy only addresses the collection, processing
                  and use (including disclosure) of information by us through
                  your interaction with the Site. Other websites that may be
                  accessible through links from the Site may have their own
                  privacy policies and personal information collection,
                  processing, use, and disclosure practices. Our business
                  partners may also have their own privacy policies. We
                  encourage you to familiarize yourself with the privacy
                  policies provided by these other parties prior to providing
                  them with information or taking advantage of a sponsored offer
                  or promotion.
                </p>
              </div>
              <h4 className="heading">Our Liabilities:</h4>
              <div className="desc">
                <p className="para">
                  Archinza has implemented best international market practices
                  and security policies, rules and technical measures to protect
                  the Personal Data that it has under its control from
                  unauthorised access, improper use or disclosure, unauthorised
                  modification and unlawful destruction or accidental loss.
                  However, for any data loss or theft due to unauthorized access
                  to the User’s electronic devices through which the User avails
                  the Services, Archinza shall not be held liable for any loss
                  whatsoever incurred by the User.
                </p>
              </div>
              <h4 className="heading">
                Android App Permissions required to use various features in our
                App:{" "}
              </h4>
              <div className="desc">
                <p className="para">
                  In order to have a better experience and to use all features
                  in the app, we need below permissions to be used in our
                  android app.
                </p>
                <p className="para">
                  <strong>- Account Identity & Contacts: </strong> We use it to
                  enable you to do connect using Google/facebook account. It
                  enables you to sign in through your accounts with the
                  respective website/app.
                </p>
                <p className="para">
                  <strong>- Location: </strong>
                  To provide location specific functionality like Archinza
                  Pro(s) near you.
                </p>
                <p className="para">
                  <strong>- SMS: </strong>
                  We need send and receive SMS permission, so as to read your
                  SMS and auto- populate. One Time password received on your
                  mobile number for authentication of sign in, if you do not
                  remember your password.
                </p>
                <p className="para">
                  <strong>- Call Phone: </strong>
                  We require access to make phone calls through app. You can
                  call us or any Archinza Pro(s) directly through the app.
                </p>
                <p className="para">
                  <strong>- Phone state: </strong>
                  This permission is used to detect your Android ID using which
                  we uniquely identify every user and map user related
                  activities. Using these details we also prevent any
                  transaction related fraud.
                </p>
                <p className="para">
                  <strong>- Storage: </strong>
                  This permission is used for enabling local caching of data on
                  your device to make your browsing experience faster and
                  smoother. We do not store any confidential data as part of
                  this permission.
                </p>
                <p className="para">
                  <strong>- Vibrate: </strong>This permission is used to alert
                  you on an incoming notification.
                </p>
                <p className="para">
                  <strong>- Geo services: </strong>
                  This permission is used to notify you that you have entered a
                  location and there are various Archinza Pro(s) of your
                  interest in this area.
                </p>
                <p className="para">
                  <strong>- Maps: </strong>
                  This permission is used to show you the exact location of
                  Archinza Pro(s) on a google map, it also helps you navigate
                  and assess distance from your current location.
                </p>
                <p className="para">
                  <strong>- Boot complete: </strong>
                  In case your phone restarts, we use this permission to detect
                  if in the meantime you have entered a location hotspot so that
                  we can trigger a notification informing you of the same along
                  with Archinza Pro(s) in the area.
                </p>
              </div>
              <h4 className="heading">Dispute Resolution</h4>
              <div className="desc">
                <p className="para">
                  Any and all disputes arising between the user/seller and
                  Archinza with regards to this Policy, including the
                  interpretation of the terms of this Policy shall be subject to
                  the exclusive jurisdiction of the Courts at New Delhi, India
                </p>
              </div>
              <h4 className="heading">Archinza Data Protection Officer</h4>
              <div className="desc">
                <p className="para">
                  Respecting the significance of Data Protection, Archinza has
                  nominated a responsible data protection officer. You can
                  contact the official for any query regarding the same.{" "}
                  <span className="block">
                    Email ID:{" "}
                    <a href="mailto:hello@archinza.com">hello@archinza.com</a>
                  </span>
                </p>
              </div>
              <h4 className="heading">Archinza Contact Information</h4>
              <div className="desc">
                <p className="para">
                  Registered Address: Vasant Vihar, New Delhi 110057, India {""}
                  <span className="email_para">
                    E-mail: {""}
                    <a href="mailto:hello@archinza.com">hello@archinza.com</a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
    </>
  );
};

export default PrivacyPolicy;
