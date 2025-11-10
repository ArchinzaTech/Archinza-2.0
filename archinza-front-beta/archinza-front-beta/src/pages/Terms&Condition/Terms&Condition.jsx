import React, { useEffect } from "react";
import "./terms&condition.scss";
import {
  homepageURL,
  privacypolicyURL,
} from "../../components/helpers/constant-words";
import { Link } from "react-router-dom";
import MetaDecorator from "../../components/MetaDecorator/MetaDecorator";
import FooterV2 from "../../components/FooterV2/FooterV2";
import useTheme from "../../components/useTheme/useTheme";

const Termsandcondition = () => {
  const { theme } = useTheme();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="main_conatiner">
        {/* <OldHeader /> */}
        {/* <section className="terms_sec1">
        </section> */}
        <MetaDecorator
          metaTitle="Terms And Conditions"
          metaDesc="Terms And Conditions"
          canonicalLink={window.location}
        />

        <section
          className={`terms_sec2 ${
            theme === "dark" ? "dark_mode--theme-styles" : ""
          }`}
        >
          <div className="my_container">
            <div className="text_container">
              {/* <p className="desc">
                <strong>Last updated on</strong>: 19th July 2023
              </p> */}
              <h2 className="main_heading">
                Terms and Conditions for Posting Jobs, Courses, and Events on
                Archinza
              </h2>
              {/* <div className="desc">
                <p className="para">
                  {" "}
                  This document is an electronic record in terms of Information
                  Technology Act, 2000 and rules there under as applicable and
                  the amended provisions pertaining to electronic records in
                  various statutes as amended by the Information Technology Act,
                  2000. This document is published in accordance with the
                  provisions of Rule 3 (1) of the Information Technology
                  (Intermediaries guidelines) Rules, 2011 that require
                  publishing the rules and regulations, Privacy Policy and Terms
                  of Use for access or usage of “
                  <Link to={homepageURL}>
                    <strong>ARCHINZA.com</strong>
                  </Link>
                  ” website and “<strong>ARCHINZA</strong>” application for
                  mobile and handheld devices.
                </p>
              </div> */}
              <h4 className="heading">Eligibility</h4>
              <div className="desc">
                <p className="para mb-0">
                  1.1. The business must be a registered entity with valid
                  credentials.
                </p>
                <p className="para mb-0">
                  1.2. The person posting must be authorized to represent the
                  business on Archinza.
                </p>
              </div>
              <h4 className="heading"> Content Guidelines </h4>
              <div className="desc">
                <p className="para mb-0">
                  2.1. All postings must be accurate, truthful, and free of
                  misleading information.
                </p>
                <p className="para mb-0">
                  2.2. Jobs, courses, and events must be relevant to the
                  architecture, interior design, and construction industry.
                </p>
                <p className="para mb-0">
                  2.3. Content must not contain:
                  <ul>
                    <li>Offensive, defamatory, or discriminatory language.</li>
                    <li>
                      Links or references to external sites promoting unrelated
                      services or products.
                    </li>
                  </ul>
                </p>
                <p className="para mb-0">
                  2.4. Archinza reserves the right to modify, reject, or remove
                  posts that violate these guidelines.
                </p>
              </div>
              <h4 className="heading">Responsibility for Content</h4>
              <div className="desc">
                <p className="para mb-0">
                  3.1. The business is solely responsible for the accuracy,
                  legality, and appropriateness of the posted content.
                </p>
                <p className="para mb-0">
                  3.2. Archinza is not liable for any inaccuracies,
                  misrepresentation, or disputes arising from the postings.
                </p>
              </div>
              <h4 className="heading">Payment Terms</h4>
              <div className="desc">
                <p className="para mb-0">
                  4.1. Posting fees (if applicable) must be paid in full prior
                  to the listing being published.
                </p>
                <p className="para mb-0">
                  4.2. Fees are non-refundable unless otherwise agreed upon in
                  writing by Archinza.
                </p>
              </div>
              <h4 className="heading">Prohibited Actions</h4>
              <div className="desc">
                <p className="para mb-0">
                  5.1. Businesses must not post duplicate listings, spam, or
                  content that infringes on intellectual property rights.
                </p>
                <p className="para mb-0">
                  5.2. Unauthorized solicitation of users or misuse of platform
                  features is strictly prohibited.
                </p>
              </div>
              <h4 className="heading">Compliance with Laws</h4>
              <div className="desc">
                <p className="para mb-0">
                  6.1. Businesses must comply with applicable labor laws,
                  education regulations, and other legal requirements related to
                  the content they post.
                </p>
              </div>
              <h4 className="heading">Intellectual Property</h4>
              <div className="desc">
                <p className="para mb-0">
                  7.1. By posting on Archinza, businesses grant the platform a
                  non-exclusive, royalty-free license to display, distribute,
                  and promote the content for marketing purposes.
                </p>
              </div>
              <h4 className="heading">Data Usage</h4>
              <div className="desc">
                <p className="para mb-0">
                  8.1. Archinza may use anonymized data from postings for
                  analytics and platform improvement.
                </p>
                <p className="para mb-0">
                  8.2. User data submitted in response to postings must be
                  handled in compliance with applicable privacy laws.
                </p>
              </div>
              <h4 className="heading">Account Suspension and Termination</h4>
              <div className="desc">
                <p className="para mb-0">
                  9.1. Archinza reserves the right to suspend or terminate
                  accounts for violations of these Terms and Conditions.
                </p>
                <p className="para mb-0">
                  9.2. Suspended or terminated businesses may lose access to
                  posted content without prior notice.
                </p>
              </div>
              <h4 className="heading">Disclaimer</h4>
              <div className="desc">
                <p className="para mb-0">
                  10.1. Archinza does not guarantee the performance,
                  participation, or outcomes of jobs, courses, or events posted
                  on the platform.
                </p>
                <p className="para mb-0">
                  10.2. Archinza is a matchmaking platform and does not directly
                  manage or endorse the postings.
                </p>
              </div>
              <h4 className="heading">Amendments</h4>
              <div className="desc">
                <p className="para mb-0">
                  11.1. Archinza reserves the right to update these Terms and
                  Conditions at any time.
                </p>
                <p className="para mb-0">
                  11.2. Businesses will be notified of changes via email or
                  platform notifications. Continued use of the platform
                  constitutes agreement to updated terms.
                </p>
              </div>
              <h4 className="heading">Disputes and Jurisdiction</h4>
              <div className="desc mb-0">
                <p className="para mb-0">
                  12.1. Any disputes arising from postings on Archinza shall be
                  resolved through mutual discussion.
                </p>
                <p className="para mb-0">
                  12.2. In case of legal escalation, the jurisdiction shall be
                  as per the registered address of Archinza.
                </p>
              </div>
              <hr className="my-4" />
              <div className="desc">
                <p className="para mb-0">
                  These terms ensure clarity, protect Archinza’s interests, and
                  provide a professional standard for businesses. Let me know if
                  you need any modifications or additional clauses.
                </p>
              </div>
              {/* <h4 className="heading">PROMOTION OF EVENTS</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    ARCHINZA Platform is only an aggregator/listing for
                    discovery, and not a service provider. If in any case, any
                    kind of event is promoted on the ARCHINZA Platform, which is
                    either done by ARCHINZA for us or is done by the Platform
                    for someone else, the only service that ARCHINZA is
                    providing here is of promotion, curation, planning and/or
                    information of the event.{" "}
                  </li>
                  <li>
                    Archinza Pro(s)and User(s) warrants and agrees that no
                    liability arises on the part of ARCHINZA in the case of any
                    monetary transaction, any kind of liability which arises
                    from the promotion of such events i.e. venue of the event,
                    look of the show, amenities provided by the event organisers
                    or any other activity that is related to the event. The only
                    task taken up by us is to promote, curate, plan and/or
                    inform about the event and we disclaim any other liability
                    that arises out of it.{" "}
                  </li>
                  <li>
                    The liability is disclaimed with regard to the above clause,
                    when any of the Archinza Pro(s) organizes an event and the
                    same is promoted by us on our Platform when Archinza Pro(s)
                    have used our database wherein the database has been
                    formally shared by us.{" "}
                  </li>
                  <li>
                    The liability on the part of ARCHINZA is also disclaimed
                    with regard to clause 12.2, wherein any of the Archinza
                    Pro(s) organizes an event and the same in promoted by us on
                    our Platform when Archinza Pro(s) have used our database
                    wherein the database haven’t been formally shared by us.{" "}
                  </li>
                  <li>
                    Furthermore, in future if any virtual event is promoted by
                    us, the details and the declaration for the same will be
                    sent to Archinza Pro(s) and User(s) through a separate mail
                    and the declaration mentioned in the mail shall apply to it.
                  </li>
                </ol>
              </div>
              <h4 className="heading">PROMOTIONAL CODES</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    ARCHINZA may, in ARCHINZA's sole discretion, create
                    promotional codes that may be redeemed for Account credit,
                    or other features or benefits related to the Services and/or
                    a Third Party Provider’s services, subject to any additional
                    terms that ARCHINZA establishes on a per promotional code
                    basis <em>(“Promo Codes”)</em>.{" "}
                  </li>
                  <li>
                    You agree that Promo Codes:
                    <ul>
                      <li>
                        must be used for the intended audience and purpose, and
                        in a lawful manner;{" "}
                      </li>
                      <li>
                        may not be duplicated, sold or transferred in any
                        manner, or made available to the general public (whether
                        posted to a public form or otherwise), unless expressly
                        permitted by ARCHINZA;{" "}
                      </li>
                      <li>
                        may be disabled by ARCHINZA at any time for any reason
                        without any liability to ARCHINZA;{" "}
                      </li>
                      <li>
                        may only be used pursuant to the specific terms that
                        ARCHINZA establishes for such Promo Code;{" "}
                      </li>
                      <li>are not valid for cash; </li>
                      <li>may expire prior to your use; and </li>
                      <li>
                        unless otherwise specified cannot be used more than
                        once.
                      </li>
                    </ul>
                  </li>
                  <li>
                    ARCHINZA reserves the right to withhold or deduct credits or
                    other features or benefits obtained through the use of Promo
                    Codes by you or any other user in the event that ARCHINZA
                    determines or believes that the use or redemption of the
                    Promo Code was in error, fraudulent, illegal, or in
                    violation of the applicable Promo Code terms or these Terms.
                  </li>
                </ol>
              </div>
              <h4 className="heading">
                {" "}
                DISCLAIMER OF WARRANTY; LIMITED LIABILITY
              </h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    The Archinza Pro(s) expressly agrees that use of the
                    Platform is at the Archinza Pro(s) sole risk. Neither
                    ARCHINZA, its holding or subsidiaries, Business Associates
                    nor any of their respective employees, agents, and third
                    party content providers warrant that use of the Platform
                    will be uninterrupted or error-free; nor do they make any
                    warranty as to:
                    <ul>
                      <li>
                        the results that may be obtained from use of this
                        Platform, or{" "}
                      </li>
                      <li>
                        the accuracy, reliability or content of any information,
                        service or merchandise provided through the Platform.
                      </li>
                    </ul>
                  </li>
                  <li>
                    The Platform are made accessible on an “as is” basis without
                    warranties of any kind, either express or implied,
                    including, but not limited to, warranties of title or
                    implied warranties of merchantability or fitness for a
                    particular purpose, other than those warranties which are
                    implied by and incapable of exclusion, restriction or
                    modification under the laws applicable to this agreement.
                  </li>
                  <li>
                    We do not give any warranty that the Services or the
                    Platform are free from viruses or anything else which may
                    have a harmful effect on any technology.
                  </li>
                  <li>
                    We reserve the right to change, modify substitute, suspend
                    or remove without notice any information or Voucher or
                    service from the Platform forming part of the Service from
                    time to time. Your access to the Platform and/or the
                    Services may also be occasionally restricted to allow for
                    repairs, maintenance or the introduction of new facilities
                    or services. We will attempt to restore such access as soon
                    as we reasonably can. We assume no responsibility for
                    functionality which is dependent on your browser or other
                    third party software to operate. For the avoidance of doubt,
                    we may also withdraw any information or Voucher from the
                    Platform or Services at any time.
                  </li>
                  <li>
                    We reserve the right to block access to and/or to edit or
                    remove any material which in our reasonable opinion may give
                    rise to a breach of this Agreement.
                  </li>
                  <li>
                    This disclaimer of liability applies to any damages or
                    injury caused by any failure of performance, error,
                    omission, interruption, deletion, defect, delay in operation
                    or transmission, computer virus, communication line failure,
                    theft or destruction or unauthorized access to, alteration
                    of, or use of record, whether for breach of contract,
                    tortuous behavior, negligence, or under any other cause of
                    action. The Archinza Pro(s) specifically acknowledges that
                    ARCHINZA is not liable for the defamatory, offensive or
                    illegal conduct of other users or third-parties and that the
                    risk of injury from the foregoing rests entirely with the
                    User.
                  </li>
                  <li>
                    In no event shall ARCHINZA, or any Business Associates,
                    Third Party Content Providers, Third Party Advertisers or
                    Third Party Service Providers, producing or distributing the
                    Website or the contents hereof, mobile application and any
                    software, be liable for any damages, including, without
                    limitation, direct, indirect, incidental, special,
                    consequential or punitive damages arising out of the use of
                    or inability to use the Platform. The Archinza Pro(s) hereby
                    acknowledges that the provisions of this Clause shall apply
                    to all content on the Platform.
                  </li>
                  <li>
                    In addition to the terms set forth above, neither ARCHINZA,
                    nor its subsidiaries and Business Associates, Third Party
                    Service Providers or Third Party Content Providers shall be
                    liable regardless of the cause or duration, for any errors,
                    inaccuracies, omissions, or other defects in, or
                    untimeliness or inauthenticity of, the information contained
                    within the Platform, or for any delay or interruption in the
                    transmission thereof to the user, or for any claims or
                    losses arising therefrom or occasioned thereby. None of the
                    foregoing parties shall be liable for any third-party claims
                    or losses of any nature, including without limitation lost
                    profits, punitive or consequential damages.
                  </li>
                  <li>
                    ARCHINZA will not be liable for indirect, special, or
                    consequential damages (or any loss of revenue, profits, or
                    data) arising in connection with this Agreement, even if we
                    have been advised of the possibility of such damages.
                    Further, our aggregate liability arising with respect to
                    this Agreement will not exceed the total Offer price paid or
                    payable to you under this Agreement.
                  </li>
                  <li>
                    ARCHINZA shall be under no liability whatsoever in respect
                    of any loss or damage arising directly or indirectly out of
                    the decline of authorization for any Transaction, on Account
                    of the Cardholder having exceeded the preset limit mutually
                    agreed by us with our acquiring bank from time to time.
                  </li>
                </ol>
              </div>
              <h4 className="heading">MONITORING:</h4>
              <div className="desc">
                <p className="para">
                  ARCHINZA shall have the right, but not the obligation, to
                  monitor the content of the Platform at all times, including
                  any reviews, chat rooms, forums and uploads that may
                  hereinafter be included as part of the Platform, to determine
                  compliance with this Agreement and any operating rules
                  established by ARCHINZA, as well as to satisfy any applicable
                  law, regulation or authorized government request. Without
                  limiting the foregoing, ARCHINZA shall have the right to
                  remove any material that ARCHINZA, in its sole discretion,
                  finds to be in violation of the provisions hereof or otherwise
                  objectionable.
                </p>
              </div>
              <h4 className="heading">PRIVACY</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    The Archinza Pro(s) acknowledges that all discussion for
                    ratings, comments, reviews on Archinza Business/Event pages,
                    chat rooms/ bots and/or other message or communication
                    facilities, are public and not private communications, and
                    that, therefore, others may read the User’s communications
                    without the User’s knowledge. ARCHINZA does not control or
                    endorse the content, messages or information found on any
                    Archinza Business/Event pages, and, therefore, ARCHINZA
                    specifically disclaims any liability concerning the Archinza
                    Business(es)/Event uploads and any actions/infringements of
                    copyright resulting from the User’s participation in above
                    mentioned uploads or reviews, including any objectionable
                    content. Generally, any communication which the User posts
                    on the Website (whether in chat rooms, discussion groups,
                    message boards, reviews or otherwise) is considered to be
                    non-confidential.
                  </li>
                  <li>
                    The Archinza Pro(s) acknowledges that if any review is found
                    on their Archinza Business/Event pages and it is false or
                    untrue, ARCHINZA have no liability in the same.
                  </li>
                  <li>
                    If particular web pages permit the submission of
                    communications that will be treated by ARCHINZA as
                    confidential, that fact will be stated in the privacy
                    policy. By posting comments, messages or other information
                    on the Platform, Archinza Pro(s) grants ARCHINZA the right
                    to use such comments, messages or information for
                    promotions, advertising, market research or any other lawful
                    purpose. For more information see ARCHINZA’s{" "}
                    <Link to={privacypolicyURL}>Privacy Policy</Link>.
                  </li>
                </ol>
              </div>
              <h4 className="heading">INDEMNIFICATION</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    You acknowledge and expressly agree that use of this
                    Platform is at your sole and own risk. You agree to defend,
                    indemnify and hold ARCHINZA, its affiliates and business
                    partners as well as their respective directors, officers,
                    trustees and employees harmless from any and all
                    liabilities, costs and expenses, including reasonable
                    attorneys’ fees, related to any violation of these terms of
                    use by you or users of your account, or in any way arising
                    out of the use of this web site, including without
                    limitation, the placement or transmission of any information
                    or other materials on this web site by you or users of your
                    account.
                  </li>
                  <li>
                    By accepting these Terms, you agree to indemnify, keep us
                    indemnified and otherwise hold harmless, ARCHINZA, its
                    officers, employees, agents and other partners from any
                    direct, indirect, incidental, special, consequential or
                    exemplary damages, and all other losses, costs, changes,
                    demands, proceedings, and actions, howsoever incurred by
                    ARCHINZA arising from any claims or legal proceedings which
                    are brought or threatened against us by any person resulting
                    from: (a) your use of the Platform or Services of ARCHINZA;
                    (b) unauthorized access to the Platform and ARCHINZA
                    Services; or (c) any breach of these Terms by you or any
                    other matter relating to the Platform and ARCHINZA Services.
                  </li>
                  <li>
                    In the event that any of your enquiries submitted via the
                    Website infringe any rights of any third party, you shall,
                    at your own expense and at our discretion, either obtain the
                    right to use such contribution or render such contribution
                    free from infringement.
                  </li>
                </ol>
              </div>
              <h4 className="heading">LICENSE GRANT</h4>
              <div className="desc">
                <p className="para">
                  By posting communications on or through this Website or mobile
                  application, the User shall be deemed to have granted to
                  archinza.com, a royalty-free, perpetual, irrevocable &
                  non-exclusive license to use, reproduce, modify, publish,
                  edit, translate, distribute, perform, and display the
                  communication alone or as part of other works in any form,
                  media, or technology whether now known or hereafter developed
                  (even if deleted at a future date by the user/brand) , and to
                  sublicense such rights through multiple tiers of sublicensees.
                </p>
              </div>
              <h4 className="heading">TERMINATION </h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    ARCHINZA reserves the right to terminate access to certain
                    areas or features of the Web Site to registered User(s) at
                    any time without assigning any reason and with or without
                    notice to such User(s). ARCHINZA also reserves the universal
                    right to deny access to particular User(s) to any or all of
                    its services or content without any prior notice or
                    explanation in order to protect the interests of ARCHINZA
                    and/ or other User(s) of the Platform. ARCHINZA further
                    reserves the right to limit, deny or create different access
                    to the Platform and its features with respect to different
                    User(s), or to change any or all of the features of the
                    Platform or introduce new features without any prior notice
                    to User(s).
                  </li>
                  <li>
                    One User can have only one Account with a unique e-mail ID
                    and unique phone number. If ARCHINZA has any suspicion or
                    knowledge that any of its Users have created multiple
                    Accounts with different e-mail addresses or phone numbers
                    (including but not limited to account creation by using
                    false names or providing misleading data for creating those
                    Accounts or using disposable email addresses or disposable
                    phone numbers) to take undue advantage of the promotional
                    benefits being provided on the Platform, then ARCHINZA may
                    while reserving its rights to initiate civil and/or criminal
                    proceedings against such User(s) may also at its sole
                    discretion terminate, suspend, block, restrict, cancel the
                    Account of such User(s) and/or disqualify that User and any
                    related Users from availing the services ordered or undue
                    benefits availed through these accounts.{" "}
                  </li>
                  <li>
                    ARCHINZA reserves the right to terminate the
                    membership/subscription of any User(s) temporarily or
                    permanently for any of the following reasons:
                    <ul>
                      <li>
                        If any false information in connection with their
                        account registered with ARCHINZA is provided by such
                        User(s), or if such User(s) are engaged in fraudulent or
                        illegal activities/transactions.
                      </li>
                      <li>
                        If such User(s) breaches any provisions of the
                        Agreement.
                      </li>
                      <li>
                        If such User(s) utilizes the Platform to send spam
                        messages or repeatedly publish the same product
                        information.
                      </li>
                      <li>
                        If such User(s) posts any material that is not related
                        to trade or business cooperation.
                      </li>
                      <li>
                        If such User(s) impersonates or unlawfully uses another
                        person’s or business entity’s name to post information
                        or conduct business in any manner.{" "}
                      </li>
                      <li>
                        If such User(s) is involved in unauthorized access, use,
                        modification, or control of the Platform database,
                        network or related services.
                      </li>
                      <li>
                        If such User(s) obtains by any means another registered
                        User(s) Username and/or Password.
                      </li>
                      <li>
                        Or any other User(s) activity that may not be in
                        accordance with the ethics and honest business
                        practices.
                      </li>
                    </ul>
                  </li>
                  <li>
                    If ARCHINZA terminates the membership of any registered
                    User(s) of ARCHINZA, such person will not have the right to
                    re-enroll or join the Platform under a new account or name
                    unless invited to do so in writing by ARCHINZA. In any case
                    of termination, no subscription/membership fee/charges paid
                    by the User(s) will be refunded. User(s) acknowledge that
                    inability to use the Platform wholly or partially for
                    whatever reason may have adverse effect on their business.
                    User(s) hereby agree that in no event shall ARCHINZA be
                    liable to any User(s) or any third parties for any inability
                    to use the Web Site (whether due to disruption, limited
                    access, changes to or termination of any features on the Web
                    Site or otherwise), any delays, errors or omissions with
                    respect to any communication or transmission, or any damage
                    (direct, indirect, consequential or otherwise) arising from
                    the use of or inability to use the Platform or any of its
                    features.
                  </li>
                  <li>
                    All such provisions wherein the context so requires,
                    including Clauses on Intellectual Property Rights,
                    Disclaimer of Warranty, Limitation of Liability, License
                    Grant, Indemnification and Termination above will survive
                    termination of this Agreement.
                  </li>
                  <li>
                    Our right to terminate this Agreement shall not prejudice
                    any other right or remedy we may have in respect of any
                    breach or any rights, obligations or liabilities accrued
                    prior to termination.
                  </li>
                </ol>
              </div>
              <h4 className="heading">THIRD- PARTY CONTEXT</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    ARCHINZA, similar to an Internet Service Provider, is a
                    distributor (and not a publisher) of content supplied by
                    third parties or User(s). Accordingly, ARCHINZA does not
                    have editorial control over such content posted on Archinza
                    Business(es)/Event pages. Any opinions, advice, statements,
                    services, offers, or other information or content expressed
                    or made available by third parties, including Third Party
                    Content Providers, or any other User(s) are those of the
                    respective author(s) or distributors and not of ARCHINZA.
                  </li>
                  <li>
                    Neither ARCHINZA nor any third-party provider of information
                    guarantees the accuracy, completeness, or usefulness of any
                    content, nor its merchantability or fitness for any
                    particular purpose (refer to the Clause for ‘Disclaimer of
                    Warranty, Limitation of Liability’ above for the complete
                    provisions governing limitation of liabilities and
                    disclaimers of warranty).
                  </li>
                  <li>
                    In many instances, the content available through this
                    Platform represents the opinions and judgments of the
                    respective information provider, User, or other users not
                    under contract with ARCHINZA. In that scenario, ARCHINZA
                    neither endorses nor is responsible for the accuracy or
                    reliability of any opinion, advice, upload or statement made
                    on the Platform by anyone other than authorized ARCHINZA
                    employee/spokespersons while acting in official capacities.
                  </li>
                  <li>
                    Under no circumstances will ARCHINZA be liable for any loss
                    or damage caused by User’s reliance on information obtained
                    through the Platform. It is the responsibility of User to
                    evaluate the accuracy, completeness or usefulness of any
                    information, opinion, advice etc. or other content available
                    on the Platform.
                  </li>
                </ol>
              </div>
              <h4 className="heading">LINKS TO THIRD PARTY PLATFORM</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    Links to third party Platform are provided on Web Site as a
                    convenience to User(s) and Archinza Pro(s). User(s) and
                    Archinza Pro(s) acknowledge and agree that ARCHINZA does not
                    have any control over the content of such web Platform and/
                    or any information, resources or materials provided therein.
                  </li>
                  <li>
                    ARCHINZA may allow User(s) and Archinza Pro(s) access to
                    content, products or services offered by third parties
                    through hyperlinks (in the form of word link, banners,
                    channels or otherwise) to the web Platform offered by such
                    third parties (
                    <strong>"Third Party Web/Mobile Platform"</strong>).
                    ARCHINZA advises its User(s) and Archinza Pro(s) to read the
                    terms and conditions of use and/or privacy policies
                    applicable in respect of such Third Party Web Platform prior
                    to using or accessing such Third Party Web Platform. Users
                    acknowledge and agree that ARCHINZA has no control over any
                    content offered on Third Party Web Platform, does not
                    monitor such Third Party Web Platform, and shall in no
                    manner be deemed to be liable or responsible to any person
                    for such Third Party Platform, or any content, products or
                    services made available thereof.
                  </li>
                </ol>
              </div>
              <h4 className="heading">ADVERTISEMENT:</h4>
              <div className="desc">
                <p className="para">
                  ARCHINZA may place advertisements in different locations on
                  the Platform and at different points during use of the
                  Service. These locations and points may change from time to
                  time - but we will always clearly mark which goods and
                  services are advertisements (i.e. from persons other than us),
                  so that it is clear to you which goods and services are
                  provided on an objective basis and which are not (i.e. the
                  advertisements). For this purpose, if anything is being
                  advertised by the Archinza Pro(s), you are required to have a
                  marking that shows that it is an “advertisement” or
                  “promotion”.
                </p>
              </div>
              <h4 className="heading">FORCE MAJEURE:</h4>
              <div className="desc">
                <div className="para">
                  Without prejudice to any other provision herein, ARCHINZA
                  shall not be liable for any loss, damage or penalty as a
                  result of any delay in or failure to deliver or otherwise
                  perform hereunder due to any cause beyond ARCHINZA's control,
                  including, without limitation, acts of the User/
                  Divapreneur(s), embargo or other governmental act, regulation
                  or request affecting the conduct of ARCHINZA's business, fire,
                  explosion, accident, theft, vandalism, riot, acts of war,
                  strikes or other labor difficulties, lightning, flood,
                  windstorm or other acts of God.
                </div>
              </div>
              <h4 className="heading">GOVERNING LAW:</h4>
              <div className="desc">
                <div className="para">
                  This Agreement and the Privacy Policy shall be governed in all
                  respects by the laws of Indian Territory. ARCHINZA considers
                  itself and intends itself to be subject to the jurisdiction of
                  the Courts of Delhi, India only. The parties to this Agreement
                  hereby submit to the exclusive jurisdiction of the courts of
                  Delhi, India.
                </div>
              </div>
              <h4 className="heading">DISPUTE RESOLUTION:</h4>
              <div className="desc">
                <div className="para">
                  Any claim, dispute or difference arising out of this Terms of
                  Use shall be referred to Arbitration in accordance with
                  Section 7 of The Arbitration and Conciliation Act, 1996. The
                  Arbitration shall be subject to the Arbitration and
                  Conciliation Act, 1996 as maybe amended from time to time. The
                  Arbitration will be done by a Sole Arbitrator and such Sole
                  Arbitrator will be appointed by ARCHINZA. The Arbitration will
                  be conducted in accordance with the rules for conduct of
                  Arbitration proceedings then in force and applicable to the
                  proceedings. The Seat and Venue of Arbitration shall be New
                  Delhi. The proceedings shall be undertaken in English. The
                  Arbitration award shall be final and binding on the parties.
                </div>
              </div>
              <h4 className="heading">NOTICES</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    All notices or demands to or upon ARCHINZA shall be
                    effective if in writing and shall be deemed to be duly made
                    when sent to ARCHINZA to E2/6, Vasant Vihar, New Delhi
                    110057, India.
                  </li>
                  <li>
                    All notices or demands to or upon a User(s) and Archinza
                    Pro(s) shall be effective if either delivered personally,
                    sent by courier, certified mail, by facsimile or email to
                    the last-known correspondence, fax or email address provided
                    by the User(s) and Archinza Pro(s) on the Web Site, or by
                    posting such notice or demand on an area of the Web Site
                    that is publicly accessible without a charge.
                  </li>
                  <li>
                    Notice to a User(s) and Archinza Pro(s) shall be deemed to
                    be received by such User(s) and Archinza Pro(s) if and when
                    Web Site is able to demonstrate that communication, whether
                    in physical or electronic form, has been sent to such
                    User(s), or immediately upon Web Site’s posting such notice
                    on an area of the Web Site that is publicly accessible
                    without charge.
                  </li>
                </ol>
              </div>
              <h4 className="heading">SEVERABILITY:</h4>
              <div className="desc">
                <p className="para">
                  In the event that any provision of these Terms of Service is
                  determined to be unlawful, void or unenforceable, such
                  provision shall nonetheless be enforceable to the fullest
                  extent permitted by applicable law, and the unenforceable
                  portion shall be deemed to be severed from these Terms of
                  Service, such determination shall not affect the validity and
                  enforce-ability of any other remaining provisions.
                </p>
              </div>
              <h4 className="heading">
                PRODUCT/SERVICES TAKE DOWN POLICY: REPORTING VIOLATION OF
                INFRINGEMENT
              </h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    User(s) acknowledge and agree that ARCHINZA is not an
                    arbiter or judge of disputes concerning intellectual
                    property rights and as such cannot verify that Archinza
                    Pro(s) selling or supplying merchandise or providing
                    services on the Platform have the right to sell the
                    merchandise or provide the services offered by such Archinza
                    Pro(s). ARCHINZA encourages User(s) and Archinza Pro(s) to
                    assist ARCHINZA in identifying listings on the Platform
                    which in the User(s) and Archinza Pro(s) knowledge or belief
                    infringe their rights. User(s) and Archinza Pro(s) further
                    acknowledge and agree by taking down a listing, ARCHINZA
                    does not and cannot be deemed to be endorsing a claim of
                    infringement and further that in those instances in which
                    ARCHINZA declines to take down a listing, ARCHINZA does not
                    and cannot be deemed to be endorsing that the listing is not
                    infringing of third party rights or endorsing any sale or
                    supply of merchandise or services pursuant to or on account
                    of such listing.
                  </li>
                  <li>
                    However, ARCHINZA is committed to removing any infringing or
                    unlicensed product or service once an authorized
                    representative of the rights owner properly reports them to
                    us. ARCHINZA sincerely wants to ensure that item listings do
                    not infringe upon the copyright, trademark or other
                    intellectual property rights of third parties. ARCHINZA have
                    the ability to identify and request removal of allegedly
                    infringing firms/ consultants/
                    events/products/brands/services and materials. Any person or
                    company who holds intellectual property rights (such as a
                    copyright, trademark or patent) which may be infringed upon
                    by-products/brands/services listed on ARCHINZA is encouraged
                    to report the same to us through the Help section of the
                    Platform.
                  </li>
                </ol>
              </div>
              <h4 className="heading">MISCELLANEOUS</h4>
              <div className="desc">
                <ol className="decimal_number">
                  <li>
                    This Agreement, our Terms of Sale and our Privacy Policy
                    (including our Cookie policy) constitutes the entire
                    agreement between the parties with respect to the subject
                    matter hereof. No representation, undertaking or promise
                    shall be taken to have been given or be implied from
                    anything said or written in negotiations between the parties
                    prior to this Agreement except as expressly stated in this
                    Agreement. Neither party shall have any remedy in respect of
                    any untrue statement made by the other upon which that party
                    relied on when entering into this Agreement (unless such
                    untrue statement was made fraudulently or was as to a matter
                    fundamental to a party’s ability to perform this Agreement)
                    and that party’s only remedies shall be for breach of
                    contract as provided in this Agreement. However, the Service
                    is provided to you under our operating rules, policies, and
                    procedures as published from time to time on the Website.
                  </li>
                  <li>
                    No delay or omission by either Party hereto to exercise any
                    right or power occurring upon any noncompliance or default
                    by the other party with respect to any of the terms of these
                    Terms shall impair any such right or power or be construed
                    to be a waiver thereof.{" "}
                  </li>
                  <li>
                    All provisions of this Agreement apply equally to and are
                    for the benefit of ARCHINZA, its subsidiaries, any holding
                    companies of ARCHINZA, its (for their) affiliated and it (or
                    their) Third Party Content Providers and licensors and each
                    shall have the right to assert and enforce such provisions
                    directly or on its own behalf (save that this Agreement may
                    be varied or rescinded without the consent of those
                    parties).{" "}
                  </li>
                </ol>
              </div> */}
              {/* <h4 className="heading">
                FEW POINTS MISSING FROM PREV DOCUMENT. PLEASE SEE IF COVERED?
              </h4>
              <div className="desc">
                <ul>
                  <li>
                    Territory: The Website or mobile application and the
                    Services and any purchase are directed solely at those who
                    access the Website from the Republic of India.{" "}
                    <a href="https://www.archinza.com/" target="_blank">
                      <strong>Archinza.com</strong>
                    </a>{" "}
                    {""}
                    makes no representation that Service (or any goods or
                    services) are available or otherwise suitable for use
                    outside the Republic of India. If you choose to access the
                    Website or mobile application (or use the Service or make a
                    purchase) from locations outside the Republic of India, you
                    do so on your own initiative and are responsible for the
                    consequences thereof.
                  </li>
                </ul>{" "}
                <br />
                <p className="para">
                  Above point is relevant as some users may be international
                  based, but may give an india address. Lets discuss
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </main>
      {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
    </>
  );
};

export default Termsandcondition;
