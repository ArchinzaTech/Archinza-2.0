import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Upload,
  Button,
  Input,
  List,
  Avatar,
  Typography,
  message,
  Divider,
  Card,
  Space,
  Spin,
  Empty,
} from "antd";
import {
  SendOutlined,
  UploadOutlined,
  FileAddOutlined,
  FilePdfOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./Minibot.scss";
import config from "../../../../config/config";
import http from "../../../../helpers/http";
import axios from "axios";

const { Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

const MiniBot = (props) => {
  const [pdfs, setPdfs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const scrapeContentApi = config.scrap_content_api;
  const base_url = config.api_url;
  const { data } = props;
  // Scroll to bottom of chat whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mock API call to check if chat should be enabled
  useEffect(() => {
    // This would be replaced with a real API call
    const checkChatStatus = async () => {
      // Simulate API call to check if chat is enabled based on uploaded PDFs
      setIsChatEnabled(pdfs.length > 0);
    };

    checkChatStatus();
  }, [pdfs]);

  const capitalizedUsername = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    // Only accept PDF files
    if (file.type !== "application/pdf") {
      message.error("You can only upload PDF files!");
      return Upload.LIST_IGNORE;
    }

    // Set uploading state
    setIsUploading(true);

    try {
      // Simulate API call to upload file
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add file to the list
      setPdfs((prev) => [...prev, file]);
      message.success(`${file.name} uploaded successfully!`);

      // Enable chat if at least one PDF is uploaded
      if (!isChatEnabled) {
        setIsChatEnabled(true);
      }

      return false; // Prevent default upload behavior
    } catch (error) {
      message.error(`${file.name} upload failed.`);
      return Upload.LIST_IGNORE;
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a PDF from the list
  const removePdf = async (fileToRemove) => {
    console.log(fileToRemove);
    const fields = {
      knowledge_base_name: capitalizedUsername(data?.username),
      s3_bucket_name: config.aws_bucket,
      object_name: `Documents/${fileToRemove?.name}`,
    };
    const encodedData = new URLSearchParams(fields).toString();

    const response = await http.shaharPost(
      `${scrapeContentApi}delete_name_object_from_s3/`,
      encodedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    setPdfs(pdfs.filter((file) => file.uid !== fileToRemove.uid));
    message.info(`${fileToRemove.name} removed`);
  };

  // Handle submit button click
  const handleSubmitPdfs = async () => {
    if (pdfs.length === 0) return;

    const scrapeContentApiData = new FormData();
    const formData = new FormData();
    const fieldsToAppend = [
      {
        key: "knowledge_base_name",
        value: capitalizedUsername(data?.username),
      },
      {
        key: "s3_bucket_name",
        value: config.aws_bucket,
      },
      {
        key: "record_id",
        value: data?._id,
      },
      {
        key: "build_knowledge_base_en",
        value: true,
      },
    ];

    // Append regular fields to FormData
    fieldsToAppend.forEach(({ key, value }) =>
      scrapeContentApiData.append(key, value)
    );
    pdfs.forEach((file) => {
      formData.append("file", file);
    });
    // Append each PDF file to the 'files' field
    pdfs.forEach((file) => {
      scrapeContentApiData.append("files", file);
    });

    setIsSubmitting(true);

    await Promise.all([
      await axios.post(
        `${scrapeContentApi}upload_documents_to_name_in_s3/`,
        scrapeContentApiData
      ),
      // await http.post(
      //   `${base_url}/business/knowledge-base-media/${data._id}`,
      //   formData
      // ),
    ]);

    message.success("PDFs submitted successfully!");
    setIsSubmitting(false);
  };
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Capitalize the first letter of knowledge_base_name
    const username = data?.username || "";

    // Prepare data for application/x-www-form-urlencoded
    const fields = {
      knowledge_base_name: capitalizedUsername(username),
      question: inputValue,
      length: "SHORT",
      language: "ENGLISH",
    };

    // Encode data as application/x-www-form-urlencoded
    const encodedData = new URLSearchParams(fields).toString();

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Send API request with URL-encoded data
      const response = await http.shaharPost(
        `${scrapeContentApi}ask_question_fg/`,
        encodedData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Log the full response for debugging
      console.log("API Response:", response);

      // Add bot response to chat using API response
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        content: response.result?.answer || "No response received from the bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to get response from the bot");
    } finally {
      setIsSending(false);
    }
  };
  // Message item component
  const MessageItem = ({ message }) => {
    const isBot = message.sender === "bot";

    return (
      <div className={`message-item ${isBot ? "bot-message" : "user-message"}`}>
        <div className="message-avatar">
          <Avatar
            icon={isBot ? <RobotOutlined /> : <UserOutlined />}
            className={isBot ? "bot-avatar" : "user-avatar"}
          />
        </div>
        <div className="message-content">
          <div className="message-header">
            <Text strong>{isBot ? "PDF Bot" : "You"}</Text>
            <Text type="secondary" className="message-time">
              {message.timestamp}
            </Text>
          </div>
          <div className="message-text">
            <Text>{message.content}</Text>
          </div>
        </div>
        <Avatar />
      </div>
    );
  };

  return (
    <Layout className="minibot-container">
      <Content>
        <Card className="minibot-card">
          <Title level={3} className="minibot-title">
            <RobotOutlined /> PDF Chat Bot
          </Title>

          <Divider orientation="left">Upload PDFs</Divider>

          <div className="upload-section">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              maxCount={5}
              multiple
              disabled={isUploading}
            >
              <Button
                icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
                type="primary"
                loading={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload PDFs"}
              </Button>
            </Upload>
            <Text type="secondary" className="upload-hint">
              Upload PDF files to chat with the bot about their content
            </Text>
          </div>

          {pdfs.length > 0 && (
            <>
              <Divider orientation="left">Uploaded Files</Divider>
              <List
                className="pdf-list"
                itemLayout="horizontal"
                dataSource={pdfs}
                renderItem={(file) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removePdf(file)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<FilePdfOutlined />}
                          style={{ backgroundColor: "#ff4d4f" }}
                        />
                      }
                      title={file.name}
                      description={`Size: ${(file.size / 1024).toFixed(2)} KB`}
                    />
                  </List.Item>
                )}
              />
              <div className="submit-section">
                <Button
                  type="primary"
                  icon={
                    isSubmitting ? <LoadingOutlined /> : <FileAddOutlined />
                  }
                  onClick={handleSubmitPdfs}
                  loading={isSubmitting}
                  disabled={pdfs.length === 0 || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit PDFs"}
                </Button>
              </div>
            </>
          )}

          <Divider orientation="left">Chat</Divider>

          <div className="chat-container">
            <div className="messages-container">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))
              ) : (
                <Empty
                  description={
                    isChatEnabled
                      ? "Send a message to start chatting about your PDFs"
                      : "Upload PDFs to enable chat"
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <TextArea
                placeholder={
                  isChatEnabled
                    ? "Type your message..."
                    : "Upload PDFs to enable chat"
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                // disabled={!isChatEnabled || isSending}
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={isSending ? <LoadingOutlined /> : <SendOutlined />}
                onClick={handleSendMessage}
                // disabled={!isChatEnabled || !inputValue.trim() || isSending}
                loading={isSending}
                className="send-button"
              />
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default MiniBot;
