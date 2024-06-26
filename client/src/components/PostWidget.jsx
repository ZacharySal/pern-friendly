import {
  BookmarkBorder,
  CachedOutlined,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, Typography, useTheme } from "@mui/material";
import AlertMessage from "components/AlertMessage";
import PostStatistic from "components/PostStatistic";
import RepostButton from "components/RepostButton";
import UserImage from "components/UserImage";
import { ModalContext } from "contexts/ModalContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, deletePost, patchLike, patchSave } from "store/postsSlice";

const PostWidget = ({
  post,
  mutateURL,
  isPostPage = false,
  isChain = false,
  isRepost = false,
  condensed = false,
}) => {
  const [showAlert, setShowAlert] = useState(false);

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const time = timeAgo.format(new Date(post.created_at), "twitter");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { setModalContext } = useContext(ModalContext);

  const loggedInUserId = useSelector((state) => state.user.user.id);

  const isLiked = Boolean(post?.likes?.some((post) => post.user_id === loggedInUserId));
  const isSaved = Boolean(post?.saves?.some((save) => save.user_id === loggedInUserId));
  const repostCount = post?.children?.filter((post) => post?.isRepost)?.length;

  const handleRepost = async () => {
    const formData = new FormData();
    formData.append("user_id", loggedInUserId);
    formData.append("parent_id", post.id);
    formData.append("isRepost", true);

    dispatch(addPost({ formData, mutateKey: mutateURL }));
    navigate(`/post/${post.id}`);
    setModalContext({ show: false });
  };

  const handleProfileClick = (e, user_id) => {
    e.stopPropagation();
    navigate(`/profile/${user_id}`);
  };

  // if post is a repost without a quote
  if (post.content == null) return <PostWidget post={post.parent} mutateURL={mutateURL} isRepost />;

  return (
    <Box
      padding={condensed ? "0.75rem" : "0.75rem 1.5rem 0rem 1rem"}
      width="100%"
      cursor="pointer"
      border={condensed ? `1px solid ${palette.neutral.light}` : null}
      borderRadius={condensed ? "12px" : "0px"}
      borderBottom={isChain || condensed ? null : `1px solid ${palette.neutral.light}`}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post.id}`);
      }}
      sx={{
        transition: "background-color 0.25s ease",
        "&:hover": {
          backgroundColor: palette.mode === "light" ? palette.neutral.light : "",
          cursor: "pointer",
        },
      }}
    >
      {isRepost && (
        <Box
          paddingLeft="1.5rem"
          marginBottom="0.5rem"
          color={palette.neutral.medium}
          display="flex"
          gap="0.5rem"
          alignItems="center"
        >
          <CachedOutlined sx={{ color: palette.neutral.medium, fontSize: "18px" }} />
          <Typography variant="h7" color={palette.neutral.medium} fontWeight="500">
            {post.author.display_name} reposted
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: condensed ? null : "auto 1fr",
          gridTemplateRows: condensed ? "auto auto" : null,
          gap: condensed ? "0rem" : "1rem",
        }}
      >
        <Box
          display={condensed ? "flex" : "grid"}
          gap={condensed ? "0.5rem" : null}
          gridTemplateRows={condensed ? null : "auto 1fr"}
        >
          <UserImage
            picture_key={post.author.profile_img_key}
            user_id={post.author.id}
            size={condensed ? "25px" : "40px"}
          />
          {isChain && (
            <Box
              sx={{
                position: "relative",
                top: "1px",
                left: "50%",
                width: "2.5px",
                height: "116%",
                transform: "translateX(-50%)",
                backgroundColor: palette.neutral.light,
              }}
            ></Box>
          )}
          {condensed && (
            <AuthorInfo author={post.author} time={time} handleClick={handleProfileClick} />
          )}
        </Box>

        <Box flexDirection="column">
          {!condensed && (
            <AuthorInfo author={post.author} time={time} handleClick={handleProfileClick} />
          )}
          {post.parent_id && !isPostPage && !post.isRepost && (
            <Box display="flex" alignItems="center" gap="0.2rem" mb="0.25rem">
              <Typography variant="h7" color={palette.neutral.medium}>
                Replying to
              </Typography>
              <Typography
                onClick={(e) =>
                  handleProfileClick(
                    e,
                    condensed || isRepost ? post.author.id : post.parent?.author?.id
                  )
                }
                variant="h7"
                fontWeight="500"
                color={palette.primary.main}
              >
                @
                {condensed || isRepost
                  ? post.author.display_name
                  : post.parent?.author?.display_name}
              </Typography>
            </Box>
          )}
          <Typography variant="h5" lineHeight="1.4">
            {post.content}
          </Typography>
          {post.isRepost && !condensed && !isPostPage && (
            <Box mt="0.5rem">
              <PostWidget post={post.parent} condensed={true} />
            </Box>
          )}
          {!condensed && (
            <Box
              display="flex"
              mt="0.5rem"
              marginLeft="-5px"
              width="100%"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <PostStatistic
                hoverColor={palette.primary.main}
                name="Reply"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalContext({
                    show: true,
                    type: "reply",
                    post: post,
                  });
                }}
              >
                <ChatBubbleOutlineOutlined
                  sx={{ fontSize: "18px", color: palette.neutral.medium }}
                />
                <Typography
                  marginLeft="0.35rem"
                  variant="h7"
                  sx={{ color: palette.neutral.medium }}
                >
                  {post.children?.length || "0"}
                </Typography>
              </PostStatistic>
              <RepostButton
                repostCount={repostCount}
                handleRepostClick={handleRepost}
                handleQuoteClick={(e) => {
                  e.stopPropagation();
                  setModalContext({
                    show: true,
                    type: "quote",
                    post: post,
                  });
                }}
              />
              <PostStatistic
                hoverColor="rgb(229,24,128)"
                name="Likes"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    patchLike({
                      post_id: post.id,
                      mutateKey: mutateURL,
                    })
                  );
                }}
              >
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: "rgb(229,24,128)", fontSize: "18px" }} />
                ) : (
                  <FavoriteBorderOutlined
                    sx={{ color: palette.neutral.medium, fontSize: "18px" }}
                  />
                )}
                <Typography
                  marginLeft="0.35rem"
                  color={isLiked ? "rgb(229, 24, 128)" : palette.neutral.medium}
                >
                  {post.likes?.length ?? 0}
                </Typography>
              </PostStatistic>
              <PostStatistic
                hoverColor={palette.primary.main}
                name="Saved"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    patchSave({
                      post_id: post.id,
                      mutateKey: mutateURL,
                    })
                  );
                }}
              >
                {isSaved ? (
                  <BookmarkIcon sx={{ color: palette.primary.main, fontSize: "18px" }} />
                ) : (
                  <BookmarkBorder sx={{ color: palette.neutral.medium, fontSize: "18px" }} />
                )}

                <Typography
                  sx={{ color: isSaved ? palette.primary.main : palette.neutral.medium }}
                  ml="0.25rem"
                  variant="h6"
                >
                  {post.saves?.length || "0"}
                </Typography>
              </PostStatistic>
            </Box>
          )}
        </Box>
      </Box>
      {showAlert && (
        <AlertMessage
          setShowAlert={setShowAlert}
          confirmationAction={() => dispatch(deletePost(post.id))}
          text={"Delete this post forever?"}
        />
      )}
    </Box>
  );
};

const AuthorInfo = ({ author, time, handleClick }) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Typography
        onClick={(e) => handleClick(e, author.id)}
        variant="h5"
        fontWeight="500"
        marginRight="0.25rem"
        className="link"
      >
        {`${author.first_name} ${author.last_name}`}
      </Typography>
      <Typography
        onClick={(e) => handleClick(e, author.id)}
        variant="h6"
        color={palette.neutral.medium}
      >
        {` @${author.display_name}`}
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        ∙
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        {time ?? ""}
      </Typography>
    </Box>
  );
};
export default PostWidget;
